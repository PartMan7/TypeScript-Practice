import { useFetch } from '@/hooks/useFetch';

type Exercise = {
  name: string;
  desc: string;
  path: string;
  difficulty: number;
};

export function Exercises() {
  const { data, loading } = useFetch<{ exercises: Exercise[] }>('/api/exercises');
  const exercises = data?.exercises ?? [];
  return (
    <>
      <h2 className="text-3xl m-24">Welcome to TypeScript exercises!</h2>
      <br />
      {loading ? (
        'Loading exercises...'
      ) : (
        <>
          <div className="m-4 flex flex-wrap justify-center w-full max-w-196 gap-6">
            {exercises.map(exercise => (
              <a
                href={`/exercise/${exercise.path.replace(/\.template\.ts$/, '')}`}
                className="cursor-pointer h-32 w-42 flex flex-col items-center justify-center bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 p-2 relative"
                key={exercise.path}
              >
                <span className="absolute top-0 right-2 text-sm">{'☆'.repeat(exercise.difficulty)}</span>
                <span className="text-lg uppercase">{exercise.name}</span>
                {exercise.desc ? (
                  <>
                    <span />
                    <span className="text-sm">{exercise.desc}</span>
                  </>
                ) : null}
              </a>
            ))}
          </div>
        </>
      )}
    </>
  );
}
