import { useState } from "react";
import { useBaitulMaal } from "../hooks/useBaitulMaal";
import { Table, THead } from "../components/ui/Table";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { Badge } from "../components/ui/Badge";
import { Input } from "../components/ui/Input"; // Pake komponen lu, Bre!
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
} from "lucide-react";

// Interface biar TS kaga tantrum
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
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null); // State video baru

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
      // 🔥 upload image
      const uploadedImages = await Promise.all(
        selectedImages.map((file) => uploadToCloudinary(file)),
      );

      const imageUrls = uploadedImages.map((res) => res.secure_url);

      // 🔥 upload video
      let videoUrls: string[] = [];

      if (selectedVideo) {
        const uploadedVideo = await uploadToCloudinary(selectedVideo);
        videoUrls = [uploadedVideo.secure_url];
      }

      // 🔥 payload JSON
      const payload = {
        id: formData.id,
        title: formData.title,
        tagline: formData.tagline,
        description: formData.description,
        category: formData.category,
        features: features.filter((f) => f.trim() !== ""),
        images: imageUrls,
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-neutral-900 dark:text-white">
            <Heart className="text-red-500" size={28} fill="currentColor" />{" "}
            Baitul Maal
          </h1>
          <p className="text-neutral-500 text-sm">
            Dashboard Manajemen Program Sosial Mabes.
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700">
          <Plus size={18} className="mr-2" /> Rilis Program
        </Button>
      </div>

      {/* FILTER */}
      <div className="w-full md:w-80">
        <Input
          label=""
          placeholder="Cari program donasi..."
          className="pl-10"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl overflow-hidden shadow-sm">
        <Table>
          <THead>
            <tr>
              <th className="px-6 py-4 text-left">Program</th>
              <th className="px-6 py-4 text-left">Kategori</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </THead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {isLoading ? (
              <tr>
                <td
                  colSpan={3}
                  className="p-20 text-center animate-pulse text-neutral-400 italic">
                  Lagi narik data dari database Bun... 🚬
                </td>
              </tr>
            ) : Array.isArray(programs) && programs.length > 0 ? (
              programs.map((p: BaitulMaalItem) => (
                <tr
                  key={p.id}
                  className="hover:bg-neutral-50/50 transition-colors">
                  <td className="px-6 py-4 text-left">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images?.[0]}
                        className="w-10 h-10 rounded-xl object-cover"
                        alt=""
                      />
                      <div>
                        <p className="font-bold text-sm text-neutral-800 dark:text-neutral-200 leading-none">
                          {p.title}
                        </p>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          ID: {p.id}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-left">
                    <Badge>{p.category}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(p)}>
                        <Edit3 size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteProgram(p.id)}>
                        <Trash2 size={16} className="text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="p-20 text-center text-neutral-400">
                  Belum ada data, Bre.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* MODAL CRUD */}
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

          {/* DYNAMIC FEATURES */}
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

          {/* UPLOAD */}
          <div className="p-4 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl bg-neutral-50/50 dark:bg-neutral-900/50">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-2 mb-3">
              <ImageIcon size={16} /> Media Program
            </label>
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

            {/* INPUT VIDEO (OPSIONAL) */}
            <div className="p-4 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl bg-neutral-50/50 dark:bg-neutral-900/50">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-2 mb-3">
                <Video size={16} className="text-blue-500" /> Video Program
                (Opsional)
              </label>
              <input
                type="file"
                accept="video/*"
                className="text-[10px] w-full file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700"
                onChange={(e) => setSelectedVideo(e.target.files?.[0] || null)}
              />
            </div>
            {/* Preview Foto dari Database */}
            {isEditMode &&
              formData.images.length > 0 &&
              !selectedImages.length && (
                <div className="mt-3">
                  <p className="text-[10px] font-bold text-neutral-400 mb-2 uppercase">
                    Foto Aktif di Database:
                  </p>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {formData.images.map((imgUrl, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={imgUrl}
                          className="w-20 h-20 object-cover rounded-xl border border-neutral-200 shadow-sm"
                          alt="Data Fetch"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                          <span className="text-[8px] text-white font-bold">
                            LAMA
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
