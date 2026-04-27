import { useState } from "react";
import { useGallery } from "../hooks/useGallery";
import { Modal } from "../components/ui/Modal";
import { Button } from "../components/ui/Button";
import { uploadToCloudinary } from "../utils/uploadCloudinary";
import {
  Plus,
  Trash2,
  Image as ImageIcon,
  Maximize2,
  Camera,
  X,
  Play,
} from "lucide-react";
import type { gallery as IGallery, IGalleryPayload } from "../api/gallery";
import { Badge } from "../components/ui/Badge";
import Title from "../components/common/Title";
import Swal from "sweetalert2";
import { useThemeStore } from "../store/themeStore";
import { toast } from "sonner";

const Gallery = () => {
  const { items, isLoading, addPhoto, deleteImage } = useGallery();

  const { isDarkMode } = useThemeStore();

  // --- UI STATES ---
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

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
    setIsUploading(true);

    try {
      const uploadedItems = []; // 1. Bikin wadahnya dulu di sini

      for (const file of tempFiles) {
        const isVideo = file.type.startsWith("video");

        // 2. Nembak Cloudinary (Satu per satu)
        const res = await uploadToCloudinary(file);

        // 3. NAH, TAROH DI SINI, BGSD!
        // Tepat setelah 'res' dapet balikan dari Cloudinary
        uploadedItems.push({
          src: res.secure_url,
          publicId: res.public_id,
          type: (isVideo ? "video" : "image") as "video" | "image", // Pake 'as' biar TS kaga rewel
          alt: file.name.split(".")[0],
          size: file.size,
        });
      }

      // 4. Setelah looping kelar, baru setor semua ke Backend
      await addPhoto({ items: uploadedItems } as IGalleryPayload);

      setIsUploadOpen(false);
      setTempFiles([]);
      toast.success("Mabes Dokumentasi Update, Bre!");
    } catch (err) {
      console.error("Gagal nyetor konten, Bre!", err);
      toast.error("Gagal upload, server lu meriang kali!");
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
        deleteImage(id);
      }
    });
  };

  return (
    <div className="p-6 space-y-6">
      <Title>Gallery | Dashboard Admin</Title>
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-neutral-900 p-8 rounded-[2.5rem] border border-neutral-100 dark:border-neutral-800 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-indigo-500 rounded-3xl shadow-lg shadow-indigo-500/20 text-white">
            <Camera size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter text-neutral-900 dark:text-white leading-none">
              Mabes Dokumentasi
            </h1>
            <p className="text-neutral-500 text-sm font-medium mt-1">
              {
                items.length
                //   Property 'length' does not exist on type '{}'.
              }{" "}
              Foto kenangan tersimpan.
            </p>
          </div>
        </div>
        <Button
          onClick={() => setIsUploadOpen(true)}
          className="bg-neutral-900 dark:bg-indigo-600 py-7 px-8 rounded-2xl shadow-xl transition-all active:scale-95">
          <Plus size={20} className="mr-2" /> Tambah Dokumen
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
            (items as IGallery[]).map((img: IGallery, index: number) => (
              <div
                key={img.publicId || index}
                className="group relative aspect-square bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                {/* 🔥 LOGIC THUMBNAIL: CEK TIPE KONTEN */}
                {img.type === "video" ? (
                  <div className="relative w-full h-full">
                    <video
                      src={img.src}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      muted
                      playsInline
                      onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
                      onMouseOut={(e) => {
                        const v = e.target as HTMLVideoElement;
                        v.pause();
                        v.currentTime = 0; // Balik ke awal biar rapi
                      }}
                    />
                    {/* Icon Play di Pojok biar User tau ini Video, bgsyad! */}
                    <div className="absolute top-3 left-3 p-2 bg-black/40 backdrop-blur-md rounded-full text-white">
                      <Play size={12} fill="currentColor" />
                    </div>
                  </div>
                ) : (
                  <img
                    src={img.src}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    alt={img.alt || "Dokumentasi KSPPS"}
                  />
                )}

                {/* OVERLAY ACTIONS - KITA KASIH POINTER EVENTS NONE PAS AWAL */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[1px] pointer-events-none group-hover:pointer-events-auto">
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (img.src) {
                        openPreview(img.src);
                      }
                    }}
                    className="p-3 bg-white/20 hover:bg-indigo-500 text-white rounded-2xl transition-all shadow-xl">
                    <Maximize2 size={20} />
                  </Button>
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      confirmDelete(img._id || "");
                    }}
                    className="p-3 bg-red-500/80 hover:bg-red-600 text-white rounded-2xl transition-all shadow-xl">
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
              Pilih foto kegiatan KSPPS (Bisa banyak sekaligus)
            </p>
            <input
              type="file"
              multiple
              accept="image/*, video/*"
              className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-indigo-50 file:text-indigo-700 cursor-pointer"
              onChange={handleFileChange}
            />
          </div>

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

          <Button
            onClick={handleUpload}
            className="w-full py-7 bg-indigo-600 rounded-2xl"
            isLoading={isUploading}>
            {isUploading ? "Lagi nembak Cloudinary..." : "Masukin Galeri 🚀"}
          </Button>
        </div>
      </Modal>

      {/* --- MODAL PREVIEW (Lightbox) --- */}
      {isPreviewOpen && selectedImg && (
        <div className="fixed inset-0 z-999 flex items-center justify-center p-4 md:p-10 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
          <button
            onClick={() => setIsPreviewOpen(false)}
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all z-1000">
            <X size={24} />
          </button>

          {/* 🔥 TS-SAFE: Casting ke array gallery biar dia nemu property .src ama .type */}
          {(items as unknown as { items: IGallery[] }).items?.find(
            (i) => i.src === selectedImg,
          )?.type === "video" || selectedImg.match(/\.(mp4|webm|ogg|mov)$/i) ? (
            <video
              src={selectedImg}
              className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain animate-in zoom-in-95 duration-300"
              controls
              autoPlay
            />
          ) : (
            <img
              src={selectedImg}
              className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain animate-in zoom-in-95 duration-300"
              alt="Preview"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Gallery;
