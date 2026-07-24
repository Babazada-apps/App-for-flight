import React, { useState } from 'react';
import { Plane } from 'lucide-react';

interface LoginProps {
  onLogin: (token: string, role: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await res.json();

      if (res.ok && data.token) {
        onLogin(data.token, data.role);
      } else {
        setError(data.error || 'Giriş uğursuz oldu');
      }
    } catch (err) {
      setError('Serverə qoşulmaq mümkün olmadı');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#fdfcf9] font-sans text-[#1a1a1a]">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-[#e5e5e5]">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="bg-[#1a1a1a] p-3 rounded-xl mb-4">
            <Plane className="w-8 h-8 text-[#fdfcf9] rotate-45" />
          </div>
          <h1 className="text-2xl font-bold tracking-tighter">ATLAS</h1>
          <p className="text-sm text-gray-500 mt-1 uppercase font-semibold">Uçuşlara Nəzarət Sistemi</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Sistem Şifrəsi</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#1a1a1a] focus:ring-1 focus:ring-[#1a1a1a] outline-none transition-all"
              placeholder="Şifrəni daxil edin"
              required
            />
          </div>

          {error && <div className="text-red-500 text-sm font-medium text-center">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1a1a1a] text-white py-3 rounded-lg font-semibold hover:bg-black transition-colors shadow-lg shadow-black/10 disabled:opacity-70"
          >
            {loading ? 'Yoxlanılır...' : 'Daxil Ol'}
          </button>
        </form>
      </div>
    </div>
  );
}
