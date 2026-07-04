import { useEffect, useState } from "react";

export default function useReports(loader, params = {}) {
  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {
    load();
  }, [JSON.stringify(params)]);

  async function load() {
    setLoading(true);

    try {
      const res = await loader(params);

      setData(res.data);

      setError(null);
    } catch (err) {
      console.error(err);

      setError(err);
    } finally {
      setLoading(false);
    }
  }

  return {
    data,
    loading,
    error,
    reload: load,
  };
}