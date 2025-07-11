import { useFetch } from '@/hooks/useFetch';
import { Button } from '@/components/ui/button';

export function Exercises() {
  const { data, loading } = useFetch<{ exercises: string[] }>('/api/exercises');
  const exercises = data?.exercises ?? [];
  return (
    <>
      <h2 className="text-3xl m-24">Welcome to TypeScript exercises!</h2>
      <br />
      {loading ? (
        'Loading exercises...'
      ) : (
        <>
          <div className="m-4 flex justify-around w-full max-w-196">
            {exercises.map(exercise => (
              <a href={`/exercise/${exercise}`} key={exercise}>
                <Button value={exercise} className="cursor-pointer h-16 w-42 flex items-center justify-center text-lg uppercase">
                  {exercise}
                </Button>
              </a>
            ))}
          </div>
        </>
      )}
    </>
  );
}
