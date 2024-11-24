import Search from "~/components/Search";
import Table from "~/components/Table";

export default function AdminBuldings() {
  function handleSearch(term: string) {
    console.log(term);
  }

  return (
    <>
      <Search handleSearch={handleSearch} placeholder="Search for a building" />
      <Table
        columns={["name"]}
        rows={[
          {
            name: "Ketler",
          },
        ]}
        options={{
          export: false,
          search: false,
        }}
      />
    </>
  );
}
