import { useState } from "react";
import { useUser, type RegistrationData } from "../hooks/useUser";
import { Table, THead } from "../components/ui/Table";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { Badge } from "../components/ui/Badge";
import {
  Check,
  Trash2,
  Eye,
  Phone,
  Shield,
  Search,
  Users,
  Clock,
} from "lucide-react";
import Title from "../components/common/Title";

const RegisterUser = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"pending" | "verified">("pending");

  const {
    registrations,
    registrationDetail,
    approveUser,
    isApproving,
    isDeleting,
    isDetailLoading,
    isLoading,
    deleteRegistration,
  } = useUser(undefined, selectedId || undefined);

  // 🔍 Filter data berdasarkan tab
  const filteredData = registrations.filter((reg: RegistrationData) =>
    activeTab === "pending" ? !reg.isVerified : reg.isVerified,
  );

  const handleOpenDetail = (id: string) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const handleApprove = (id: string) => {
    if (window.confirm("Yakin mau ACC pendaftar ini, Bre?")) {
      approveUser(id);
      setIsModalOpen(false);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Beneran mau dimusnahkan? Kaga bisa balik lagi loh.")) {
      deleteRegistration(id);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Title>
        Register ACC | Dashboard Admin
      </Title>
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-neutral-900 dark:text-white">
            <Shield className="text-emerald-500" size={28} /> Manajemen
            Registrasi
          </h1>
          <p className="text-neutral-500 text-sm">
            Kelola antrean dan pendaftar yang sudah sah.
          </p>
        </div>
        <div className="flex items-center bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 px-3 py-2 rounded-xl">
          <Search size={18} className="text-neutral-400 mr-2" />
          <input
            type="text"
            placeholder="Cari nama..."
            className="bg-transparent border-none outline-none text-sm w-full"
          />
        </div>
      </div>

      {/* TABS SELECTOR */}
      <div className="flex p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab("pending")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "pending"
              ? "bg-white dark:bg-neutral-700 text-emerald-600 shadow-sm"
              : "text-neutral-500 hover:text-neutral-700"
          }`}>
          <Clock size={16} /> Antrean Pending
          {registrations.filter((r) => !r.isVerified).length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 bg-emerald-500 text-white text-[10px] rounded-full">
              {registrations.filter((r) => !r.isVerified).length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("verified")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "verified"
              ? "bg-white dark:bg-neutral-700 text-emerald-600 shadow-sm"
              : "text-neutral-500 hover:text-neutral-700"
          }`}>
          <Users size={16} /> Sudah Terverifikasi
        </button>
      </div>

      {/* TABLE */}
      <div className="w-full">
        <Table>
          <THead>
            <tr>
              <th className="px-6 py-4">Nama Lengkap</th>
              <th className="px-6 py-4">Kontak</th>
              <th className="px-6 py-4">Produk</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </THead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {isLoading ? (
              <tr>
                <td
                  colSpan={4}
                  className="p-10 text-center animate-pulse text-neutral-400 italic">
                  Lagi nunggu kiriman data dari Bun... 🚬
                </td>
              </tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((reg: RegistrationData) => (
                <tr
                  key={reg._id}
                  className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center font-bold text-sm">
                        {reg.fullName.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                        {reg.fullName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-neutral-500 text-sm">
                    <div className="flex items-center gap-1">
                      <Phone size={14} /> {reg.phoneNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline">{reg.selectedProduct}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenDetail(reg._id)}>
                        <Eye size={16} className="text-neutral-400" />
                      </Button>
                      {activeTab === "pending" && (
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => handleApprove(reg._id)}
                          isLoading={isApproving && selectedId === reg._id}>
                          <Check size={16} />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:bg-red-50"
                        onClick={() => handleDelete(reg._id)}
                        isLoading={isDeleting && selectedId === reg._id}>
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-20 text-center text-neutral-400">
                  <div className="flex flex-col items-center gap-2">
                    <Shield size={40} className="opacity-20" />
                    <p>
                      Kosong, Bre.{" "}
                      {activeTab === "pending"
                        ? "Belum ada antrean."
                        : "Belum ada yang di-ACC."}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* MODAL DETAIL */}
      <Modal
      
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Data Lengkap Pendaftar">
        {isDetailLoading ? (
          <div className="p-12 text-center flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-neutral-400 text-sm">
              Bentar, lagi buka berkas...
            </p>
          </div>
        ) : registrationDetail ? (
          <div className="space-y-6 items-center">
            {/* Profil Singkat */}
            <div className="flex items-center gap-4 p-5 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-100 dark:border-neutral-700">
              <div className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xl font-black">
                {registrationDetail.fullName[0]}
              </div>
              <div>
                <h3 className="font-bold text-xl text-neutral-900 dark:text-white">
                  {registrationDetail.fullName}
                </h3>
                <Badge
                  variant={
                    registrationDetail.isVerified ? "success" : "warning"
                  }>
                  {registrationDetail.isVerified
                    ? "Terverifikasi"
                    : "Menunggu ACC"}
                </Badge>
              </div>
            </div>

            {/* Grid Data */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "NIK", value: registrationDetail.ktpNumber },
                { label: "Tempat Lahir", value: registrationDetail.birthPlace },
                { label: "Tanggal lahir", value: registrationDetail.birthDate },
                { label: "Gender", value: registrationDetail.gender },
                { label: "Alamat KTP", value: registrationDetail.addressKTP },
                {
                  label: "Alamat Domisili",
                  value: registrationDetail.addressDomisili,
                },
                { label: "HP", value: registrationDetail.phoneNumber },
                { label: "Pekerjaan", value: registrationDetail.occupation },
                { label: "Status", value: registrationDetail.maritalStatus },
                { label: "Pendidikan", value: registrationDetail.education },
                { label: "Agama", value: registrationDetail.religion },
                {
                  label: "Pendapatan",
                  value: registrationDetail.monthlyIncome,
                },
                { label: "Produk", value: registrationDetail.selectedProduct },
                { label: "Ahli Waris", value: registrationDetail.heirName },
                {
                  label: "Alamat Pewaris",
                  value: registrationDetail.heirAddress,
                },
                {
                  label: "Verifikasi",
                  value: registrationDetail.isVerified
                    ? "Terveifikasi"
                    : "Belum Diverifikasi",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl">
                  <p className="text-[10px] uppercase tracking-wider text-neutral-400 mb-0.5">
                    {item.label}
                  </p>
                  <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200 truncate">
                    {item.label.toLowerCase().includes("tanggal") && item.value
                      ? new Date(item.value.toString()).toLocaleDateString(
                          "id-ID",
                          {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          },
                        )
                      : item.value?.toString() || "-"}
                  </p>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <Button
                className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-500 border-none"
                onClick={() => handleDelete(registrationDetail._id)}
                isLoading={isDeleting}>
                <Trash2 size={18} />{" "}
                {registrationDetail.isVerified ? "Hapus Data" : "Tolak & Hapus"}
              </Button>
              {!registrationDetail.isVerified && (
                <Button
                  className="flex-2"
                  variant="success"
                  onClick={() => handleApprove(registrationDetail._id)}
                  isLoading={isApproving}>
                  <Check size={18} /> ACC Sekarang
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="p-10 text-center text-neutral-500">
            Data kaga ketemu, Bre.
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RegisterUser;
