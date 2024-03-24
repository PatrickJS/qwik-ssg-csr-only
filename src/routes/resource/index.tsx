import {
  Resource,
  component$,
  useResource$,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";
import { useLocation, useNavigate } from "@builder.io/qwik-city";

export default component$(() => {
  const csr = useSignal(false);
  const loc = useLocation();
  const nav = useNavigate();
  const id = loc.url.searchParams.has("id")
    ? Number(loc.url.searchParams.get("id"))
    : 1;

  const resourceId = useSignal(id);

  useVisibleTask$(() => {
    csr.value = true;
  });

  const todoResource = useResource$<any>(async ({ track, cleanup }) => {
    track(csr);
    if (!csr.value) {
      console.log("\nlog: ~~SSG~~\n");
      return;
    }
    // runs on client
    const id = track(resourceId);
    const abortController = new AbortController();
    cleanup(() => abortController.abort("cleanup"));
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${id}`,
      {
        signal: abortController.signal,
      }
    );
    // fake delay
    await new Promise((resolve) => setTimeout(resolve, 50));

    // can be error prone without try-catch
    const data = res.json();
    return data;
  });

  return (
    <div>
      <div>
        example with query param: <code>?={resourceId.value}</code>
      </div>
      <input
        name="todo"
        value={resourceId.value}
        onInput$={(ev: any) => {
          const value = Number(ev.target.value);
          if (value > 0) {
            resourceId.value = value;
            nav(`${loc.url.pathname}?id=${ev.target.value}`);
          }
        }}
      />
      <Resource
        value={todoResource}
        onResolved={(data) => {
          return <pre>{JSON.stringify(data, null, 2)}</pre>;
        }}
        onPending={() => {
          return <div>Loading...</div>;
        }}
        onRejected={(err) => {
          return <div>{err.message}</div>;
        }}
      />
    </div>
  );
});
