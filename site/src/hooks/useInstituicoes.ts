import { useState, useEffect } from 'react';
import type { VehicleType, Instituicao } from '../data/instituicoes';

const API_URL = import.meta.env.VITE_API_URL || '';
const CACHE_KEY = 'cred-auto:instituicoes';
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

interface CacheEntry {
  data: Record<VehicleType, Instituicao[]>;
  timestamp: number;
}

interface UseInstituicoesResult {
  data: Record<VehicleType, Instituicao[]> | null;
  loading: boolean;
  error: string | null;
}

export function useInstituicoes(): UseInstituicoesResult {
  const [data, setData] = useState<Record<VehicleType, Instituicao[]> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      // Check localStorage cache first
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const entry: CacheEntry = JSON.parse(cached);
          if (Date.now() - entry.timestamp < CACHE_TTL) {
            if (!cancelled) {
              setData(entry.data);
              setLoading(false);
            }
            return;
          }
        }
      } catch {
        // Cache miss, continue to fetch
      }

      // Fetch from API
      try {
        const response = await fetch(`${API_URL}/api/data`);
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        const apiData = await response.json() as Record<VehicleType, Instituicao[]>;

        // Cache in localStorage
        try {
          const entry: CacheEntry = { data: apiData, timestamp: Date.now() };
          localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
        } catch {
          // localStorage full, ignore
        }

        if (!cancelled) {
          setData(apiData);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load data');
          setLoading(false);
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { data, loading, error };
}
