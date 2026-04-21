import { useState } from "react";
import { useBaitulMaal } from "../hooks/useBaitulMaal";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { Badge } from "../components/ui/Badge";
import { Input } from "../components/ui/Input"; 
import type { CreateBaitulMaal } from "../api/baitulMaal";
import { uploadToCloudinary } from "../utils/uploadCloudinary";
import {
  Plus,
  Trash2,
  Edit3,
  Heart,
  Image as ImageIcon,
  ListPlus,
  X,
  Video,
  Box,
  ChevronRight,
} from "lucide-react";

interface BaitulMaalItem extends CreateBaitulMaal {
  id: string;
  images: string[];
}

type Category = "SOSIAL" | "KEMANUSIAAN" | "KESEHATAN";

const BaitulMaal = () => {
  const { programs, isLoading, createProgram, updateProgram, deleteProgram } =
    useBaitulMaal();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<{
    id: string;
    title: string;
    tagline: string;
    description: string;
    category: Category;
    images: string[];
  }>({
    id: "",
    title: "",
    tagline: "",
    description: "",
    category: "SOSIAL",
    images: [],
  });

  const [features, setFeatures] = useState<string[]>([""]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);

  const handleEdit = (program: BaitulMaalItem) => {
    setIsEditMode(true);
    setSelectedId(program.id);
    setFormData({
      id: program.id,
      title: program.title || "",
      tagline: program.tagline || "",
      description: program.description || "",
      category: program.category,
      images: program.images || [],
    });
    setFeatures(program.features || [""]);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedId(null);
    setFormData({
      id: "",
      title: "",
      tagline: "",
      description: "",
      category: "SOSIAL",
      images: [],
    });
    setFeatures([""]);
    setSelectedImages([]);
    setSelectedVideo(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const uploadedImages = await Promise.all(
        selectedImages.map((file) => uploadToCloudinary(file)),
      );
      const imageUrls = uploadedImages.map((res) => res.secure_url);

      let videoUrls: string[] = [];
      if (selectedVideo) {
        const uploadedVideo = await uploadToCloudinary(selectedVideo);
        videoUrls = [uploadedVideo.secure_url];
      }

      const payload = {
        id: formData.id,
        title: formData.title,
        tagline: formData.tagline,
        description: formData.description,
        category: formData.category,
        features: features.filter((f) => f.trim() !== ""),
        images: imageUrls.length > 0 ? imageUrls : formData.images, // Logic fallback image
        videoUrl: videoUrls,
      };

      if (isEditMode && selectedId) {
        await updateProgram({ id: selectedId, data: payload });
      } else {
        await createProgram(payload);
      }

      handleCloseModal();
    } catch (err) {
      console.error("Gagal eksekusi, Bre!", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-neutral-900 p-8 rounded-[2.5rem] border border-neutral-100 dark:border-neutral-800 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-rose-500 rounded-3xl shadow-lg shadow-rose-500/20 text-white">
            <Heart size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter text-neutral-900 dark:text-white leading-none">
              Mabes Baitul Maal
            </h1>
            <p className="text-neutral-500 text-sm font-medium mt-1">
              Program sosial, kemanusiaan, & kesehatan terpadu.
            </p>
          </div>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-neutral-900 dark:bg-rose-600 py-7 px-8 rounded-2xl shadow-xl transition-all active:scale-95">
          <Plus size={20} className="mr-2" /> Rilis Program
        </Button>
      </div>

      {/* GRID LAYOUT (Baitul Maal Version) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-80 bg-neutral-100 dark:bg-neutral-800 animate-pulse rounded-4xl" />
          ))
        ) : Array.isArray(programs) && programs.length > 0 ? (
          programs.map((p: BaitulMaalItem) => (
            <div key={p.id} className="group relative bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-4xl overflow-hidden hover:shadow-2xl transition-all duration-300">
              {/* Image Preview */}
              <div className="aspect-video w-full overflow-hidden bg-neutral-100 relative">
                <img src={p.images?.[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                <div className="absolute top-4 right-4">
                  <Badge variant={p.category === "SOSIAL" ? "success" : "info"}>{p.category}</Badge>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-[10px] font-mono text-neutral-400 mb-1">ID: {p.id}</p>
                <h3 className="font-black text-lg uppercase tracking-tight text-neutral-800 dark:text-white truncate">{p.title}</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2 mt-2 leading-relaxed">
                  {p.tagline || p.description}
                </p>

                {/* Actions Grid Style */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-neutral-50 dark:border-neutral-800">
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" className="rounded-xl bg-neutral-50 dark:bg-neutral-800" onClick={() => handleEdit(p)}>
                      <Edit3 size={16} />
                    </Button>
                    <Button size="sm" variant="ghost" className="rounded-xl bg-red-50 dark:bg-red-900/10 text-red-500" onClick={() => deleteProgram(p.id)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                  <button className="flex items-center gap-1 text-[10px] font-black uppercase text-rose-600 hover:gap-2 transition-all">
                    Lihat Program <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full p-20 text-center border-2 border-dashed border-neutral-200 rounded-[3rem]">
            <Box size={48} className="mx-auto text-neutral-300 mb-4" />
            <p className="text-neutral-400 font-bold">Data kosong melompong, Bre!</p>
          </div>
        )}
      </div>

      {/* MODAL CRUD (Logic Tetap) */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={isEditMode ? "Update Program" : "Rilis Program Baru"}>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Slug ID"
              disabled={isEditMode}
              required
              placeholder="id-program-sosial"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
            />
            <div className="space-y-1.5 w-full">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Kategori
              </label>
              <select
                className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl outline-none focus:border-emerald-500 text-sm"
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value as Category,
                  })
                }>
                <option value="SOSIAL">SOSIAL</option>
                <option value="KEMANUSIAAN">KEMANUSIAAN</option>
                <option value="KESEHATAN">KESEHATAN</option>
              </select>
            </div>
          </div>

          <Input
            label="Judul Program"
            required
            placeholder="Contoh: Sedekah Subuh Berkah"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />

          <Input
            label="Tagline"
            placeholder="Singkat, padat, ngena..."
            value={formData.tagline}
            onChange={(e) =>
              setFormData({ ...formData, tagline: e.target.value })
            }
          />

          <div className="space-y-1.5 w-full">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Deskripsi
            </label>
            <textarea
              required
              rows={3}
              className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl outline-none focus:border-emerald-500 text-sm resize-none"
              placeholder="Ceritain tujuannya di sini..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Fitur Program
              </label>
              <button
                type="button"
                onClick={() => setFeatures([...features, ""])}
                className="text-emerald-600 text-xs font-bold flex items-center gap-1">
                <ListPlus size={14} /> TAMBAH
              </button>
            </div>
            {features.map((f, idx) => (
              <div key={idx} className="flex gap-2">
                <Input
                  label=""
                  placeholder={`Fitur ${idx + 1}`}
                  value={f}
                  onChange={(e) => {
                    const newFeat = [...features];
                    newFeat[idx] = e.target.value;
                    setFeatures(newFeat);
                  }}
                />
                {features.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setFeatures(features.filter((_, i) => i !== idx))
                    }
                    className="mt-7 text-red-400">
                    <X size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="p-4 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl bg-neutral-50/50 dark:bg-neutral-900/50">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-2 mb-3">
              <ImageIcon size={16} /> Foto Program (Multi)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              className="text-[10px] w-full file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:bg-emerald-50 file:text-emerald-700"
              onChange={(e) =>
                setSelectedImages(Array.from(e.target.files || []))
              }
            />

            {selectedImages.length > 0 && (
              <div className="mt-2 space-y-2">
                <p className="text-[10px] font-bold text-emerald-600 uppercase">
                  Preview Foto Baru:
                </p>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {selectedImages.map((file, idx) => (
                    <img
                      key={idx}
                      src={URL.createObjectURL(file)}
                      className="w-16 h-16 object-cover rounded-lg border-2 border-emerald-500"
                      alt="New Preview"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl bg-neutral-50/50 dark:bg-neutral-900/50">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-2 mb-3">
              <Video size={16} className="text-blue-500" /> Video Program (Opsional)
            </label>
            <input
              type="file"
              accept="video/*"
              className="text-[10px] w-full file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700"
              onChange={(e) => setSelectedVideo(e.target.files?.[0] || null)}
            />
          </div>

          <Button
            type="submit"
            className="w-full py-4 bg-emerald-600 font-bold uppercase tracking-widest shadow-lg shadow-emerald-500/20"
            isLoading={isSubmitting}>
            {isEditMode ? "Simpan Perubahan 🪄" : "Rilis Program Sekarang 🚀"}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default BaitulMaal;