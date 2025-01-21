import Loading from "~/components/common/Loading";

export default function ResponseOidc() {
  return (
    <div className="h-screen flex items-center justify-center">
      <Loading title="Authenticating..." />
    </div>
  );
}
