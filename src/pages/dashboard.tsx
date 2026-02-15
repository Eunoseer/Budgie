import { Table } from "../components/table";

function Dashboard() {
  return (
    <>
      <header className="header">
        <h1>Dashboard</h1>
        <p>Welcome to your application dashboard</p>
      </header>
      <section className="card v25">
        <h2>Overview</h2>
        <p>
          This is a sample card component. It demonstrates the full styling from
          your CSS boilerplate including typography, button styles, and
          responsive design.
        </p>
      </section>
      <section className="card v75">
        <Table />
      </section>
    </>
  );
}

export default Dashboard;
