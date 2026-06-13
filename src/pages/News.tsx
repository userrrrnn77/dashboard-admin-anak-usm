// src/pages/News.tsx
import React, { useEffect, useState } from "react";
import { useNews } from "../hooks/useNews";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { Badge } from "../components/ui/Badge";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { uploadToCloudinary } from "../utils/uploadCloudinary";
import {
  Plus,
  Trash2,
  Newspaper,
  Image as ImageIcon,
  Box,
  ChevronRight,
  Calendar,
  Search,
} from "lucide-react";
import Title from "../components/common/Title";
import Swal from "sweetalert2";
import { useThemeStore } from "../store/themeStore";
import { toast } from "sonner";

// Definisikan interface internal agar tipe data sinkron sempurna
interface NewsItem {
  _id?: string;
  id?: string; // Menjaga kompatibilitas jika ada mapping ID
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  images: string[];
  category: string;
  createdAt?: string;
}

type CategoryType = "Berita Koperasi" | "Artikel" | "Pengumuman";

const News = () => {
  // Panggil React-Query Hooks yang sudah kita bangun sebelumnya
  const { newsList, isLoading, createNews, deleteNews } = useNews();
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
  },[])

  // --- UI STATES ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  // --- FORM STATES ---
  const [formData, setFormData] = useState<{
    title: string;
    excerpt: string;
    content: string;
    category: CategoryType;
    images: string[];
  }>({
    title: "",
    excerpt: "",
    content: "",
    category: "Berita Koperasi",
    images: [],
  });

  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  // Fungsi menutup modal dan membersihkan seluruh state form
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      category: "Berita Koperasi",
      images: [],
    });
    setSelectedImages([]);
  };

  // Handler bapak bijaksana untuk membuka overview detail berita
  const handleOpenDetail = (news: NewsItem) => {
    setSelectedNews(news);
    setIsDetailOpen(true);
  };

  // Jalur pemrosesan form submit kasta Silicon Valley
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Hitung total gambar gabungan (yang sudah ada + yang baru akan diunggah)
      const totalImagesCount = formData.images.length + selectedImages.length;

      // Proteksi mutlak level frontend: gambar wajib diisi dan maksimal 4 lembar foto
      if (totalImagesCount === 0) {
        toast.error(
          "Wajib mengunggah minimal 1 foto sebagai cover berita, Bre!",
        );
        setIsSubmitting(false);
        return;
      }

      if (totalImagesCount > 4) {
        toast.error(
          "Format foto melebihi batas. Maksimal hanya boleh 4 foto untuk kolase grid!",
        );
        setIsSubmitting(false);
        return;
      }

      // Unggah foto baru ke Cloudinary secara paralel menggunakan Promise.all
      const uploadedImages = await Promise.all(
        selectedImages.map((file) => uploadToCloudinary(file)),
      );
      const newImageUrls = uploadedImages.map((res) => res.secure_url);

      // Susun payload akhir yang steril sebelum ditembak ke database
      const payload: NewsItem = {
        title: formData.title.trim(),
        slug: formData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, ""),
        excerpt:
          formData.excerpt.trim() || formData.content.substring(0, 120) + "...",
        content: formData.content.trim(),
        category: formData.category,
        images: [...formData.images, ...newImageUrls],
      };

      // Jalankan fungsi mutasi create dari React Query hook kita
      await createNews(payload);
      handleCloseModal();
    } catch (err) {
      console.error("Gagal memproses unggahan berita, Bre!", err);
      toast.error("Terjadi kesalahan internal saat menyimpan berita.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Konfirmasi penghapusan data menggunakan SweetAlert2 dengan gaya sopan dan steril
  const confirmDelete = async (id: string, title: string) => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: `Berita "${title}" akan dihapus secara permanen dari sistem.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
      background: isDarkMode ? "#171717" : "#fff",
      color: isDarkMode ? "#fff" : "#171717",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteNews(id);
    } catch (error) {
      console.error(error);
    }
  };

  // Filter pencarian lokal agar manajemen data terasa sangat responsif dan instan
  const filteredNews = newsList.filter(
    (item: NewsItem) =>
      item.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.category.toLowerCase().includes(searchKeyword.toLowerCase()),
  );

  return (
    <div className="p-6 space-y-6">
      <Title>Mabes Berita & Artikel | Dashboard Admin</Title>

      {/* HEADER UTAMA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-neutral-900 p-8 rounded-[2.5rem] border border-neutral-100 dark:border-neutral-800 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-emerald-600 rounded-3xl shadow-lg shadow-emerald-600/20 text-white">
            <Newspaper size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter text-neutral-900 dark:text-white leading-none">
              Mabes Berita Koperasi
            </h1>
            <p className="text-neutral-500 text-sm font-medium mt-1">
              Manajemen publikasi artikel, pengumuman, dan berita resmi Mitra
              Hasanah.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Bar Pencarian Berita */}
          <div className="relative flex-1 md:w-64 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Cari berita..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs focus:outline-none focus:border-emerald-500 transition-all text-neutral-800 dark:text-neutral-100"
            />
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-600 text-white py-6 px-6 rounded-2xl shadow-xl transition-all active:scale-95 shrink-0">
            <Plus size={18} className="mr-1" /> Tulis Berita
          </Button>
        </div>
      </div>

      {/* GRID DAFTAR CARD BERITA */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-80 bg-neutral-100 dark:bg-neutral-800 animate-pulse rounded-4xl"
            />
          ))
        ) : filteredNews.length > 0 ? (
          filteredNews.map((item: NewsItem) => (
            <div
              key={item._id}
              className="group relative bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-4xl overflow-hidden hover:shadow-2xl transition-all duration-300">
              {/* Cover Image Preview */}
              <div className="aspect-video w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800 relative">
                <img
                  src={item.images?.[0]}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt={item.title}
                />
                <div className="absolute top-4 right-4">
                  <Badge
                    variant={
                      item.category === "Berita Koperasi"
                        ? "success"
                        : item.category === "Artikel"
                          ? "info"
                          : "warning"
                    }>
                    {item.category}
                  </Badge>
                </div>
              </div>

              {/* Teks Konten Singkat */}
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-1.5 text-neutral-400 text-[11px] font-semibold">
                  <Calendar size={14} className="text-emerald-600" />
                  <span>
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "Baru Saja"}
                  </span>
                </div>

                <h3 className="font-black text-lg uppercase tracking-tight text-neutral-800 dark:text-white truncate">
                  {item.title}
                </h3>

                <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                  {item.excerpt}
                </p>

                {/* Grid Aksi Managerial */}
                <div className="flex items-center justify-between pt-4 border-t border-neutral-50 dark:border-neutral-800">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-xl bg-red-50 dark:bg-red-900/10 text-red-500 hover:bg-red-100"
                    onClick={() => confirmDelete(item._id!, item.title)}>
                    <Trash2 size={16} />
                  </Button>

                  <button
                    className="flex items-center gap-1 text-[10px] font-black uppercase text-emerald-600 hover:gap-2 transition-all cursor-pointer"
                    onClick={() => handleOpenDetail(item)}>
                    Pratinjau <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full p-20 text-center border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-[3rem]">
            <Box size={48} className="mx-auto text-neutral-300 mb-4" />
            <p className="text-neutral-400 font-bold">
              Belum ada publikasi berita yang terdaftar
            </p>
          </div>
        )}
      </div>

      {/* MODAL PENULISAN BERITA BARU */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Publikasikan Berita Baru">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
          <div className="space-y-1.5 w-full">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Kategori Berita
            </label>
            <select
              className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl outline-none focus:border-emerald-500 text-sm"
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value as CategoryType,
                })
              }>
              <option value="Berita Koperasi">Berita Koperasi</option>
              <option value="Artikel">Artikel / Edukasi</option>
              <option value="Pengumuman">Pengumuman Resmi</option>
            </select>
          </div>

          <Input
            label="Judul Berita / Artikel"
            required
            placeholder="Contoh: Pelaksanaan Monitoring Dan Evaluasi Kinerja Caturwulan I"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />

          <Input
            label="Ringkasan Singkat (Excerpt)"
            placeholder="Kosongkan jika ingin generate otomatis dari isi konten..."
            value={formData.excerpt}
            onChange={(e) =>
              setFormData({ ...formData, excerpt: e.target.value })
            }
          />

          <Textarea
            label="Isi Konten Berita"
            required
            rows={5}
            placeholder="Ketikkan seluruh isi informasi berita secara mendalam di sini..."
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
          />

          {/* Area Unggah Gambar dengan Validasi Maksimal 4 Lembar */}
          <div className="p-4 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl bg-neutral-50/50 dark:bg-neutral-900/50">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-2 mb-3">
              <ImageIcon size={16} className="text-emerald-600" /> Foto
              Dokumentasi Berita (Maksimal 4 Foto)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              className="text-[10px] w-full file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:bg-emerald-50 file:text-emerald-700 cursor-pointer"
              onChange={(e) =>
                setSelectedImages(Array.from(e.target.files || []))
              }
            />

            {selectedImages.length > 0 && (
              <div className="mt-3 space-y-2">
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                  Pratinjau File Lampiran ({selectedImages.length} Terpilih):
                </p>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {selectedImages.map((file, idx) => (
                    <img
                      key={idx}
                      src={URL.createObjectURL(file)}
                      className="w-16 h-16 object-cover rounded-lg border-2 border-emerald-500 shrink-0"
                      alt="Upload Preview"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full py-4 bg-emerald-600 font-bold uppercase tracking-widest shadow-lg shadow-emerald-500/20"
            isLoading={isSubmitting}>
            Publikasikan Berita Sekarang 🚀
          </Button>
        </form>
      </Modal>

      {/* MODAL DETAIL OVERVIEW PRATINJAU BERITA */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Overview Detail Publikasi">
        {selectedNews && (
          <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Banner Utama Berita */}
            <div className="relative h-56 rounded-3xl overflow-hidden shadow-md border border-neutral-100 dark:border-neutral-700">
              <img
                src={selectedNews.images?.[0]}
                className="w-full h-full object-cover"
                alt={selectedNews.title}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent flex items-end p-6">
                <div className="space-y-1.5 w-full">
                  <Badge
                    variant={
                      selectedNews.category === "Berita Koperasi"
                        ? "success"
                        : selectedNews.category === "Artikel"
                          ? "info"
                          : "warning"
                    }>
                    {selectedNews.category}
                  </Badge>
                  <h2 className="text-xl font-black text-white uppercase tracking-tight leading-tight line-clamp-2">
                    {selectedNews.title}
                  </h2>
                </div>
              </div>
            </div>

            {/* Cuplikan Ringkasan */}
            <div className="bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-800 rounded-2xl p-4">
              <p className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-1">
                Kutipan Singkat
              </p>
              <p className="text-sm italic font-medium text-neutral-600 dark:text-neutral-300 pl-2 border-l-4 border-emerald-500">
                "{selectedNews.excerpt}"
              </p>
            </div>

            {/* Isi Artikel Penuh */}
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400">
                Konten Utama
              </h3>
              <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 whitespace-pre-line bg-white dark:bg-neutral-800 rounded-2xl pl-1">
                {selectedNews.content}
              </p>
            </div>

            {/* Galeri Foto Tambahan (Jika Lebih dari 1 Foto) */}
            {selectedNews.images && selectedNews.images.length > 1 && (
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400">
                  Dokumentasi Kolase Tambahan ({selectedNews.images.length - 1})
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {selectedNews.images.slice(1).map((img, idx) => (
                    <div
                      key={idx}
                      className="aspect-square rounded-xl overflow-hidden border border-neutral-100 dark:border-neutral-700">
                      <img
                        src={img}
                        className="w-full h-full object-cover"
                        alt="Galeri Tambahan"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Penutup Modal Pratinjau */}
            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-700 flex gap-3">
              <Button
                onClick={() => setIsDetailOpen(false)}
                variant="outline"
                className="w-full py-3.5 font-bold rounded-xl">
                Tutup Pratinjau
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default News;
