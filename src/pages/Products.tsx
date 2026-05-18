import { useState, useMemo } from "react"; // Tambah useMemo biar makin gacor
import { useProduct } from "../hooks/useProduct";
import { Modal } from "../components/ui/Modal";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { Textarea } from "../components/ui/Textarea";
import { Select } from "../components/ui/Select";
import { uploadToCloudinary } from "../utils/uploadCloudinary";
import {
  Plus,
  Edit3,
  Trash2,
  Package,
  Image as ImageIcon,
  ChevronRight,
  Box,
  PlusCircle,
  MinusCircle,
} from "lucide-react";

import type { product as IProduct, product } from "../api/product";
import { type productDetail as IProductDetail } from "../api/productDetail";
import Title from "../components/common/Title";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { useThemeStore } from "../store/themeStore";

const Products = () => {
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const {
    products,
    productDetail,
    isLoading,
    isActionLoading,
    createProduct,
    updateProduct,
    deleteProduct,
    createDetail,
    updateDetail,
  } = useProduct(selectedProduct?.id);

  const { isDarkMode } = useThemeStore();

  // --- UI STATES ---
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  // --- FORM STATES ---
  const [formData, setFormData] = useState<IProduct>({
    id: "",
    title: "",
    fullTitle: "",
    desc: "",
    category: "simpanan",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [detailData, setDetailData] = useState<IProductDetail>({
    title: "",
    description: "",
    sections: [{ subtitle: "", items: [""] }],
  });

  // --- COMPUTED DATA (FILTER & SORT) ---
  // Kita pake useMemo biar sorting cuma jalan kalo data 'products' beneran berubah
  const displayProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];

    return [...products].reverse();
  }, [products]);

  // --- HANDLERS ---
  const handleOpenForm = (p?: IProduct) => {
    if (p) {
      setIsEditMode(true);
      setSelectedProduct(p);
      setFormData({
        id: p.id || "",
        title: p.title || "",
        fullTitle: p.fullTitle || "",
        desc: p.desc || "",
        category: p.category || "simpanan",
        image: p.image,
        publicId: p.publicId,
      });
      // ambil detail existing
      if (productDetail) {
        setDetailData({
          title: productDetail.title || "", // Property 'title' does not exist on type '{}'.
          description: productDetail.description || "", // Property 'description' does not exist on type '{}'.
          sections: productDetail.sections?.length // Property 'sections' does not exist on type '{}'.
            ? productDetail.sections // Property 'sections' does not exist on type '{}'.
            : [{ subtitle: "", items: [""] }],
        });
      }
    } else {
      setIsEditMode(false);
      setSelectedProduct(null);
      setFormData({
        id: "",
        title: "",
        fullTitle: "",
        desc: "",
        category: "simpanan",
      });
      setDetailData({
        title: "",
        description: "",
        sections: [{ subtitle: "", items: [""] }],
      });
      setStep(1);
    }
    setSelectedFile(null);
    setIsFormOpen(true);
  };

  const handleOpenDetail = (p: IProduct) => {
    setSelectedProduct(p);
    setIsDetailOpen(true);
  };

  const addSection = () => {
    setDetailData({
      ...detailData,
      sections: [...(detailData.sections || []), { subtitle: "", items: [""] }],
    });
  };

  const removeSection = (index: number) => {
    const newSections = [...(detailData.sections || [])];
    newSections.splice(index, 1);
    setDetailData({ ...detailData, sections: newSections });
  };

  const addItem = (sectionIdx: number) => {
    const newSections = [...(detailData.sections || [])];
    newSections[sectionIdx].items.push("");
    setDetailData({ ...detailData, sections: newSections });
  };

  const removeItem = (sectionIdx: number, itemIdx: number) => {
    const newSections = [...(detailData.sections || [])];
    newSections[sectionIdx].items.splice(itemIdx, 1);
    setDetailData({ ...detailData, sections: newSections });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (step === 1) {
        if (!selectedFile && !isEditMode) {
          toast.error("Cover produk wajib bre!");
          return;
        }

        let imageUrl = formData.image;
        let publicId = selectedProduct?.publicId;

        if (selectedFile) {
          const cloudRes = await uploadToCloudinary(selectedFile);
          imageUrl = cloudRes.secure_url;
          publicId = cloudRes.public_id;
        }

        const payload = { ...formData, image: imageUrl, publicId };

        if (isEditMode && selectedProduct?.id) {
          await updateProduct({ id: selectedProduct.id, data: payload });
          setStep(2);
          toast.success("Katalog aman, gas update jeroannya!");
        } else {
          await createProduct(payload);
          setDetailData((prev) => ({
            ...prev,
            title: formData.fullTitle || formData.title,
          }));
          setStep(2);
        }
      } else {
        const finalPayload = {
          id: formData.id || "",
          title: detailData.title || formData.fullTitle || "",
          description: detailData.description || "",
          sections: (detailData.sections || [])
            .map((sec) => ({
              subtitle: sec.subtitle,
              items: sec.items.filter((item) => item.trim() !== ""),
            }))
            .filter((sec) => sec.subtitle.trim() !== ""),
        };

        if (isEditMode) {
          await updateDetail({ id: String(formData.id), data: finalPayload });
          toast.success("Jeroan berhasil di-PATCH 🪄");
        } else {
          await createDetail(finalPayload);
          toast.success("Barang rilis sempurna 🚀");
        }

        setIsFormOpen(false);
        setStep(1);
      }
    } catch (err) {
      console.error("Gagal rilis barang, Bre!", err);
      toast.error("Waduh, gagal bre!");
    }
  };

  const productLists = products as product[];

  // terus async yang buat delet taroh mana bre? await taroh mana njir?
  const confirmDelete = async (id: string) => {
    const itemMauDihapus = productLists.find((p) => p.id === id);

    const result = await Swal.fire({
      title: "Yakin mau dibuang?",
      text: `Data ${itemMauDihapus?.title || "Ini"} bakal ilang selamanya!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Iya, Hapus!",
      cancelButtonText: "Batal",
      background: isDarkMode ? "#171717" : "#fff",
      color: isDarkMode ? "#fff" : "#171717",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteProduct(id);

      toast.success("Produk berhasil dimusnahkan 🗑️");
    } catch (error) {
      console.error(error);
      toast.error("Gagal hapus produk!");
    }
  };

  const resetForm = () => {
    setStep(1);
    setSelectedFile(null);
    setSelectedProduct(null);
    setIsEditMode(false);

    setFormData({
      id: "",
      title: "",
      fullTitle: "",
      desc: "",
      category: "simpanan",
    });

    setDetailData({
      title: "",
      description: "",
      sections: [{ subtitle: "", items: [""] }],
    });
  };

  return (
    <div className="p-6 space-y-6">
      <Title>Products | Dashboard Admin</Title>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-neutral-900 p-8 rounded-[2.5rem] border border-neutral-100 dark:border-neutral-800 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-emerald-500 rounded-3xl shadow-lg shadow-emerald-500/20 text-white">
            <Package size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter text-neutral-900 dark:text-white leading-none">
              Mabes Katalog
            </h1>
            <p className="text-neutral-500 text-sm font-medium mt-1">
              Direct Upload & Step Detail Enabled.
            </p>
          </div>
        </div>
        <Button
          onClick={() => handleOpenForm()}
          className="bg-neutral-900 dark:bg-emerald-600 py-7 px-8 rounded-2xl shadow-xl transition-all active:scale-95">
          <Plus size={20} className="mr-2" /> Tambah Produk
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-64 bg-neutral-100 dark:bg-neutral-800 animate-pulse rounded-4xl"
            />
          ))
        ) : displayProducts.length > 0 ? (
          displayProducts.map((p: IProduct) => (
            <div
              key={p.id}
              className="group relative bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-4xl overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="aspect-video w-full overflow-hidden bg-neutral-100">
                <img
                  src={p.image}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  alt=""
                />
                <div className="absolute top-4 right-4">
                  <Badge
                    variant={p.category === "simpanan" ? "success" : "warning"}>
                    {p.category}
                  </Badge>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-black text-lg uppercase tracking-tight text-neutral-800 dark:text-white truncate">
                  {p.title}
                </h3>
                <p className="text-xs text-neutral-400 font-mono mt-1 italic">
                  ID: {p.id}
                </p>
                <div className="flex items-center justify-between mt-6">
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="rounded-xl"
                      onClick={() => handleOpenForm(p)}>
                      <Edit3 size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="rounded-xl text-red-500"
                      onClick={() => p.id && confirmDelete(p.id)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                  <button
                    onClick={() => handleOpenDetail(p)}
                    className="flex items-center gap-1 text-xs font-black uppercase text-emerald-600 hover:gap-2 transition-all">
                    Detail <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full p-20 text-center border-2 border-dashed border-neutral-200 rounded-[3rem]">
            <Box size={48} className="mx-auto text-neutral-300 mb-4" />
            <p className="text-neutral-400 font-bold">
              Katalog kosong melompong!
            </p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          resetForm();
        }}
        title={
          step === 1
            ? isEditMode
              ? "Update Katalog"
              : "Step 1: Info Katalog"
            : "Step 2: Jeroan Produk"
        }>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
          {step === 1 ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Slug ID"
                  disabled={isEditMode}
                  value={formData.id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      id: e.target.value
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                        .replace(/[^a-z0-9-]/g, ""),
                    })
                  }
                />
                <Select
                  label="Kategori"
                  value={formData.category}
                  options={[
                    { label: "Simpanan", value: "simpanan" },
                    { label: "Pembiayaan", value: "pembiayaan" },
                  ]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value as "simpanan" | "pembiayaan",
                    })
                  }
                />
              </div>
              <Input
                label="Judul Katalog"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
              <Input
                label="Nama Lengkap Produk"
                value={formData.fullTitle}
                onChange={(e) =>
                  setFormData({ ...formData, fullTitle: e.target.value })
                }
              />
              <Textarea
                label="Deskripsi Singkat"
                className="min-h-25"
                value={formData.desc}
                onChange={(e) =>
                  setFormData({ ...formData, desc: e.target.value })
                }
              />
              <div className="p-4 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-3xl bg-neutral-50/50">
                <label className="text-xs font-bold flex items-center gap-2 mb-3">
                  <ImageIcon size={16} /> Cover Produk
                </label>
                <input
                  type="file"
                  className="text-xs w-full cursor-pointer"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-100 dark:border-emerald-800">
                <p className="text-[10px] font-black uppercase text-emerald-600">
                  ID Produk Terkunci:
                </p>
                <p className="text-sm font-mono font-bold text-neutral-700 dark:text-neutral-300">
                  {formData.id}
                </p>
              </div>
              <Textarea
                label="Deskripsi Jeroan"
                value={detailData.description}
                onChange={(e) =>
                  setDetailData({ ...detailData, description: e.target.value })
                }
              />
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black uppercase tracking-widest text-neutral-400">
                    Sections (Benefit/Syarat)
                  </h4>
                  <button
                    type="button"
                    onClick={addSection}
                    className="text-emerald-600">
                    <PlusCircle size={20} />
                  </button>
                </div>
                {detailData.sections?.map((sec, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-2xl space-y-3 relative">
                    <button
                      type="button"
                      onClick={() => removeSection(sIdx)}
                      className="absolute top-4 right-4 text-red-500">
                      <MinusCircle size={18} />
                    </button>
                    <Input
                      label={`Subtitle ${sIdx + 1}`}
                      value={sec.subtitle}
                      onChange={(e) => {
                        const newSecs = [...(detailData.sections || [])];
                        newSecs[sIdx].subtitle = e.target.value;
                        setDetailData({ ...detailData, sections: newSecs });
                      }}
                    />
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest ml-1">
                        Items
                      </label>
                      {sec.items.map((item, iIdx) => (
                        <div key={iIdx} className="flex gap-2 items-center">
                          <Input
                            label=""
                            value={item}
                            onChange={(e) => {
                              const newSecs = [...(detailData.sections || [])];
                              newSecs[sIdx].items[iIdx] = e.target.value;
                              setDetailData({
                                ...detailData,
                                sections: newSecs,
                              });
                            }}
                          />
                          {sec.items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeItem(sIdx, iIdx)}
                              className="text-red-400">
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addItem(sIdx)}
                        className="text-[10px] font-bold text-emerald-600 underline">
                        + Tambah Item
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <Button
            type="submit"
            className="w-full py-7 bg-emerald-600 font-black uppercase rounded-2xl"
            isLoading={isActionLoading}
            disabled={isActionLoading}>
            {step === 1
              ? isEditMode
                ? "Simpan Perubahan 🪄"
                : "Lanjut Isi Jeroan ⮕"
              : "Terbitkan Katalog Lengkap 🚀"}
          </Button>
        </form>
      </Modal>

      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Overview Produk">
        {selectedProduct && (
          <div className="space-y-6">
            <div className="relative h-56 rounded-3xl overflow-hidden shadow-inner">
              <img
                src={selectedProduct.image}
                className="w-full h-full object-cover"
                alt=""
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent flex items-end p-6">
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                  {selectedProduct.fullTitle || selectedProduct.title}
                </h2>
              </div>
            </div>
            <div className="space-y-4">
              <Badge>{selectedProduct.category}</Badge>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed italic bg-neutral-50 dark:bg-neutral-800 p-4 rounded-2xl">
                "{selectedProduct.desc || "No description."}"
              </p>
            </div>
            <Button
              onClick={() => setIsDetailOpen(false)}
              variant="outline"
              className="w-full">
              Tutup Overview
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Products;
