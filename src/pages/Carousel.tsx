import { useState } from "react";
import { Modal } from "../components/ui/Modal";
import { Button } from "../components/ui/Button";
import { uploadToCloudinary } from "../utils/uploadCloudinary";
import { Plus, Trash2, Maximize2, X, Images, ImageIcon } from "lucide-react";
import { Badge } from "../components/ui/Badge";
import Title from "../components/common/Title";
import Swal from "sweetalert2";
import { useThemeStore } from "../store/themeStore";
import { useCarousel } from "../hooks/useCarousel";
import type { ICarousel } from "../api/carousel";
import { Input } from "../components/ui/Input";
import { toast } from "sonner";

const Carousel = () => {
  const { carousels, isLoading, addCarousel, deleteCarousel } = useCarousel();

  const { isDarkMode } = useThemeStore();

  // --- UI STATES ---
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [title, setTitle] = useState("");

  // State buat handle file yang mau diupload
  const [tempFiles, setTempFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // --- HANDLERS ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setTempFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (tempFiles.length === 0) return;
    if (!title)
      return Swal.fire({
        title: "PAOK LU!",
        text: "NAMANYA ISI DULU BRE ANJAY!",
        icon: "warning",
        confirmButtonText: "oke bre siap..",
      });

    setIsUploading(true);
    try {
      // 1. Looping upload ke Cloudinary & simpan ke DB SATU-SATU
      for (const file of tempFiles) {
        // Upload ke Cloudinary
        const res = await uploadToCloudinary(file);

        const payload = {
          title: title.trim(), // Pastiin kaga kosong
          image: res.secure_url,
          publicId: res.public_id,
        };

        console.log("NEMBAK DATA INI BRE:", payload);
        
        await addCarousel(payload);
      }

      toast.success("Semua foto berhasil mendarat di Galeri! 🚀");
      handleCancelUpload(); // Pake fungsi cancel biar bersih semua state-nya
    } catch (err) {
      console.error("Gagal nyetor foto ke carousel, Bre!", err);
      toast.error("Ada yang nyangkut pas upload, cek koneksi lu!");
    } finally {
      setIsUploading(false);
    }
  };

  const openPreview = (url: string) => {
    setSelectedImg(url);
    setIsPreviewOpen(true);
  };

  const confirmDelete = (id: string) => {
    Swal.fire({
      title: "Yakin dibuang, Bre?",
      text: "Data ini bakal ilang selamanya!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus!",
      cancelButtonText: "Batal",
      theme: isDarkMode ? "dark" : "light", //  gini kan enak bre
    }).then((result) => {
      if (result.isConfirmed) {
        // 🚀 BARU PANGGIL MUTATE DI SINI!
        deleteCarousel(id);
      }
    });
  };

  const handleCancelUpload = () => {
    // 1. Bersihin Preview (Revoke URL biar memori kaga bocor)
    tempFiles.forEach((file) => {
      const url = URL.createObjectURL(file);
      URL.revokeObjectURL(url);
    });

    // 2. Kosongin State
    setTempFiles([]);
    setTitle(""); // Reset judul juga, bgsd!

    // 3. Tutup Modal
    setIsUploadOpen(false);

    toast.info("Gajadi upload? Lemah lu, Bre! 🤣");
  };

  return (
    <div className="p-6 space-y-6">
      <Title>Carousel | Dashboard Admin</Title>
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-neutral-900 p-8 rounded-[2.5rem] border border-neutral-100 dark:border-neutral-800 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-indigo-500 rounded-3xl shadow-lg shadow-indigo-500/20 text-white">
            <Images size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter text-neutral-900 dark:text-white leading-none">
              Mabes Carousel
            </h1>
            <p className="text-neutral-500 text-sm font-medium mt-1">
              {
                carousels.length
                //   Property 'length' does not exist on type '{}'.
              }{" "}
              Foto kenangan tersimpan.
            </p>
          </div>
        </div>
        <Button
          onClick={() => setIsUploadOpen(true)}
          className="bg-neutral-900 dark:bg-indigo-600 py-7 px-8 rounded-2xl shadow-xl transition-all active:scale-95">
          <Plus size={20} className="mr-2" /> Tambah Foto
        </Button>
      </div>

      {/* GRID GALLERY */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-neutral-100 dark:bg-neutral-800 animate-pulse rounded-3xl"
              />
            ))
          : // Pake interface IGallery (yang lu dapet dari import gallery)
            (carousels as ICarousel[]).map((img: ICarousel, index: number) => (
              <div
                key={img.publicId || index} // Pake publicId atau index biar kaga rewel key-nya
                className="group relative aspect-square bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                <img
                  src={img.image}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  alt={img.title || "Dokumentasi KSPPS"}
                />

                {/* OVERLAY ACTIONS */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                  <Button
                    type="button"
                    onClick={() => img.image && openPreview(img.image)}
                    className="p-3 bg-white/20 hover:bg-white/40 text-white rounded-2xl transition-all">
                    <Maximize2 size={20} />
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      confirmDelete(img._id || "");
                    }}
                    className="p-3 bg-red-500/80 hover:bg-red-500 text-white rounded-2xl transition-all">
                    <Trash2 size={20} />
                  </Button>
                </div>
              </div>
            ))}
      </div>

      {/* --- MODAL UPLOAD --- */}
      <Modal
        isOpen={isUploadOpen}
        onClose={() => !isUploading && setIsUploadOpen(false)}
        title="Upload Dokumentasi">
        <div className="space-y-6">
          <div className="p-8 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-4xl bg-neutral-50/50 flex flex-col items-center justify-center text-center">
            <ImageIcon size={48} className="text-neutral-300 mb-4" />
            <p className="text-sm font-bold text-neutral-500 mb-4">
              Pilih foto untuk dijadikan slide website (Maks 10 gambar)
            </p>
            <input
              type="file"
              multiple
              accept="image/*"
              className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-indigo-50 file:text-indigo-700 cursor-pointer"
              onChange={handleFileChange}
            />
          </div>

          <Input
            label="Masukan Namanya bre"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {tempFiles.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {tempFiles.map((file, index) => (
                <div
                  key={index}
                  className="relative aspect-video rounded-2xl overflow-hidden group border dark:border-neutral-800">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-[8px] text-white font-bold truncate px-2">
                      {file.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tempFiles.length > 0 && (
            <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-2xl">
              <p className="text-[10px] font-black uppercase text-neutral-400 mb-2">
                {tempFiles.length} File dipilih:
              </p>
              <div className="flex flex-wrap gap-2">
                {tempFiles.map((f, i) => (
                  <Badge key={i} variant="outline" className="text-[10px]">
                    {f.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              variant="danger" // Pake ghost biar kaga norak
              className="flex-1 py-7 rounded-2xl border-2 border-neutral-200 dark:border-neutral-800"
              onClick={handleCancelUpload}
              disabled={isUploading}>
              Batal
            </Button>

            <Button
              onClick={handleUpload}
              className="flex-2 py-7 bg-indigo-600 rounded-2xl"
              isLoading={isUploading}>
              {isUploading ? "Nembak Cloudinary..." : "Masukin Galeri"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* --- MODAL PREVIEW (Lightbox) --- */}
      {isPreviewOpen && selectedImg && (
        <div className="fixed inset-0 z-999 flex items-center justify-center p-4 md:p-10 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
          <button
            onClick={() => setIsPreviewOpen(false)}
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all">
            <X size={24} />
          </button>
          <img
            src={selectedImg}
            className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain animate-in zoom-in-95 duration-300"
            alt="Preview"
          />
        </div>
      )}
    </div>
  );
};

export default Carousel;
