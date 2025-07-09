import { useFetch } from '@/hooks/useFetch';
import { Button } from '@/components/ui/button';

export function Exercises() {
  const { data, loading } = useFetch<{ exercises: string[] }>('/api/exercises');
  const exercises = data?.exercises ?? [];
  return (
    <>
      Welcome to TypeScript exercises!
      <br />
      {loading ? (
        'Loading exercises...'
      ) : (
        <>
          Available exercises:
          <ul>
            {exercises.map(exercise => (
              <li key={exercise}>
                <a href={`/exercise/${exercise}`}>
                  <Button value={exercise} size="sm" className="cursor-pointer">
                    {exercise}
                  </Button>
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
