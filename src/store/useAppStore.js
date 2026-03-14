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

      reorderRackets: (nextRackets) =>
        set({
          rackets: [...nextRackets],
        }),

      deleteRacket: ({ racketId, deleteAssignedRubbers = false }) =>
        set((state) => {
          const racketToDelete = state.rackets.find((racket) => racket.id === racketId);
          if (!racketToDelete) return {};

          const assignedIds = [
            racketToDelete.forehandRubberId,
            racketToDelete.backhandRubberId,
          ].filter(Boolean);

          return {
            rackets: state.rackets.filter((racket) => racket.id !== racketId),
            rubbers: deleteAssignedRubbers
              ? state.rubbers.filter((rubber) => !assignedIds.includes(rubber.id))
              : state.rubbers,
          };
        }),

      addRubber: ({ brand, series, color = "black", spongeThickness = 2.1 }) => {
        const id = makeId();
        set((state) => ({
          rubbers: [
            ...state.rubbers,
            {
              id,
              brand,
              series,
              color,
              spongeThickness,
              hoursPlayed: 0,
              createdAt: Date.now(),
            },
          ],
        }));
        return id;
      },

      reorderRubbers: (nextRubbers) =>
        set({
          rubbers: [...nextRubbers],
        }),

      updateRubber: ({ rubberId, brand, series, color, spongeThickness }) =>
        set((state) => ({
          rubbers: state.rubbers.map((rubber) =>
            rubber.id === rubberId
              ? {
                  ...rubber,
                  brand,
                  series,
                  color: color ?? rubber.color ?? "black",
                  spongeThickness: spongeThickness ?? rubber.spongeThickness ?? 2.1,
                }
              : rubber
          ),
        })),

      deleteRubber: (rubberId) =>
        set((state) => ({
          rubbers: state.rubbers.filter((rubber) => rubber.id !== rubberId),
          rackets: state.rackets.map((racket) => ({
            ...racket,
            forehandRubberId: racket.forehandRubberId === rubberId ? null : racket.forehandRubberId,
            backhandRubberId: racket.backhandRubberId === rubberId ? null : racket.backhandRubberId,
          })),
        })),

      assignRubberToRacket: ({ racketId, side, rubberId }) => {
        const state = get();
        const targetRacket = state.rackets.find((r) => r.id === racketId);
        if (!targetRacket) return false;

        if (!rubberId) {
          set({
            rackets: state.rackets.map((r) => {
              if (r.id !== racketId) return r;
              if (side === "FH") return { ...r, forehandRubberId: null };
              return { ...r, backhandRubberId: null };
            }),
          });
          return true;
        }

        const owner = state.rackets.find(
          (r) => r.forehandRubberId === rubberId || r.backhandRubberId === rubberId
        );
        if (
          owner &&
          (owner.id !== racketId ||
            (side === "FH" && owner.backhandRubberId === rubberId) ||
            (side === "BH" && owner.forehandRubberId === rubberId))
        ) {
          return false;
        }

        set({
          rackets: state.rackets.map((r) => {
            if (r.id !== racketId) return r;
            if (side === "FH") return { ...r, forehandRubberId: rubberId };
            return { ...r, backhandRubberId: rubberId };
          }),
        });
        return true;
      },

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
