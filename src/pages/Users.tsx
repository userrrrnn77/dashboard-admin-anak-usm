import { useState } from "react";
import { useUser } from "../hooks/useUser";
import { Table, THead } from "../components/ui/Table";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { Trash2, Eye, Phone, Shield, User as UserIcon } from "lucide-react";
import { type User } from "../api/user";
import Swal from "sweetalert2";

const UsersPage = () => {
  const { users, deleteUser, isDeleting } = useUser();

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Casting biar TS lu yang galak itu sujud syukur
  const userList = users as User[];

  // --- Fungsi Delete dengan SweetAlert2 ---
  const handleDelete = (user: User) => {
    const isDark = document.documentElement.classList.contains("dark");

    Swal.fire({
      title: "Konfirmasi Pemusnahan!",
      text: `Serius lu mau hapus ${user.name}? Data ini bakal ilang selamanya, Bre!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#737373",
      confirmButtonText: "Ya, Musnahkan!",
      cancelButtonText: "Kaga jadi, Bre",
      background: isDark ? "#262626" : "#fff",
      color: isDark ? "#fff" : "#000",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser(user.phone as string);
      }
    });
  };

  return (
    <div className="space-y-10">
      {/* SECTION 2: DAFTAR USER RESMI */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            Semua Karyawan
          </h2>
          <Badge variant="success">{userList.length} Aktif</Badge>
        </div>

        <Table>
          <THead>
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </THead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
            {userList.map((user) => (
              <tr
                key={user.phone}
                className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center font-bold text-emerald-600">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-xs text-neutral-500">{user.phone}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={user.role === "ADMIN" ? "danger" : "info"}>
                    {user.role}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="p-2 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-emerald-600 rounded-lg transition-colors">
                      <Eye size={18} />
                    </button>
                    <button
                      disabled={isDeleting}
                      onClick={() => handleDelete(user)}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500 rounded-lg transition-colors disabled:opacity-50">
                      <Trash2
                        size={18}
                        className={isDeleting ? "animate-pulse" : ""}
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </section>

      {/* MODAL DETAIL USER - JEROAN LENGKAP */}
      <Modal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title="Detail Anggota Resmi">
        {selectedUser && (
          <div className="space-y-6">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full border-4 border-emerald-500 p-1 mb-4 shadow-xl shadow-emerald-500/20">
                <img
                  src={
                    (selectedUser.imageProfile as string) ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.name}`
                  }
                  alt={selectedUser.name}
                  className="w-full h-full rounded-full object-cover bg-neutral-100"
                />
              </div>
              <h3 className="text-xl font-bold">{selectedUser.name}</h3>
              <Badge
                variant={selectedUser.role === "ADMIN" ? "danger" : "info"}>
                {selectedUser.role} Member
              </Badge>
            </div>

            <div className="grid grid-cols-1 gap-4 bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white dark:bg-neutral-800 rounded-lg shadow-sm">
                  <UserIcon size={18} className="text-emerald-500" />
                </div>
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider">
                    Nama Lengkap
                  </p>
                  <p className="text-sm font-medium">{selectedUser.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-2 bg-white dark:bg-neutral-800 rounded-lg shadow-sm">
                  <Phone size={18} className="text-emerald-500" />
                </div>
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider">
                    Kontak WhatsApp
                  </p>
                  <p className="text-sm font-medium">{selectedUser.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-2 bg-white dark:bg-neutral-800 rounded-lg shadow-sm">
                  <Shield size={18} className="text-emerald-500" />
                </div>
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider">
                    Status Akses
                  </p>
                  <p className="text-sm font-medium">
                    {selectedUser.role} Access Level
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                className="flex-1"
                variant="outline"
                onClick={() => setSelectedUser(null)}>
                Tutup
              </Button>
              <Button
                variant="danger"
                className="px-4"
                onClick={() => {
                  const userToKill = selectedUser;
                  setSelectedUser(null);
                  handleDelete(userToKill);
                }}>
                <Trash2 size={18} />
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UsersPage;
