import { useNavigate } from "react-router-dom";
import Title from "../components/common/Title";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-neutral-900 p-6 text-center">
      <Title>404 Not Found</Title>
      <h1 className="text-9xl font-bold text-primary-600">404</h1>

      <div className="mt-4">
        <h2 className="text-2xl font-semibold text-slate-600">
          Nyasar Lu, Bre?
        </h2>
        <p className="text-slate-400 mt-2">
          Halaman yang lu cari kaga ketemu. Mungkin udah lu hapus atau emang lu
          lagi ngelindur.
        </p>
      </div>

      <button
        onClick={() => navigate(-1)}
        className="mt-8 px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-500 transition-all shadow-lg active:scale-95">
        ← Balik ke Halaman Sebelumnya
      </button>

      <p className="mt-4 text-sm text-slate-400 italic">
        "Kodingan udah ijo, tapi jalan hidup lu masih abu-abu." - Backend Wizard
      </p>
    </div>
  );
};

export default NotFound;
