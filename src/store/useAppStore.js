import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const useAppStore = create(
  persist(
    (set, get) => ({
      skillLevel: "Intermediate",
      rackets: [],
      rubbers: [],

      setSkillLevel: (skillLevel) => set({ skillLevel }),

      addRacket: (name) =>
        set((state) => ({
          rackets: [
            ...state.rackets,
            {
              id: makeId(),
              name: name.trim(),
              forehandRubberId: null,
              backhandRubberId: null,
              createdAt: Date.now(),
            },
          ],
        })),

      addRubber: ({ brand, series }) =>
        set((state) => ({
          rubbers: [
            ...state.rubbers,
            {
              id: makeId(),
              brand,
              series,
              hoursPlayed: 0,
              createdAt: Date.now(),
            },
          ],
        })),

      assignRubberToRacket: ({ racketId, side, rubberId }) =>
        set((state) => ({
          rackets: state.rackets.map((r) => {
            if (r.id !== racketId) return r;
            if (side === "FH") return { ...r, forehandRubberId: rubberId };
            return { ...r, backhandRubberId: rubberId };
          }),
        })),

      logSessionForRacket: ({ racketId, hours }) => {
        const state = get();
        const racket = state.rackets.find((r) => r.id === racketId);
        if (!racket) return;

        const assignedIds = [racket.forehandRubberId, racket.backhandRubberId].filter(Boolean);
        if (assignedIds.length === 0) return;

        set({
          rubbers: state.rubbers.map((rubber) =>
            assignedIds.includes(rubber.id)
              ? {
                  ...rubber,
                  hoursPlayed: Number((rubber.hoursPlayed + hours).toFixed(2)),
                }
              : rubber
          ),
        });
      },
    }),
    {
      name: "tt-rubber-track-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useAppStore;
