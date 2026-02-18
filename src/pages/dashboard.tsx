import { ExpensesTable } from "../components/expensesTable";

function Dashboard() {
  return (
    <>
      <header className="header">
        <h1>Budgie</h1>
        <h2> Budgeting Made Easy</h2>
      </header>
      <section className="card">
        <h2>Overview</h2>
        <p>
          Budgie is designed to make it easy to calculate your expenses and how
          much you should be putting away to prepare for them.
        </p>
        <p>
          This app runs entirely in your browser, meaning your personal data
          never leaves your device. If you don't believe it, feel free to check
          the code in the github repo linked at the bottom of the page.
        </p>
        <p>
          To get the most out of Budgie, you need to consider the payment
          categories and the accounts that you want to use. There are some
          defaults, but they might not work for you. Feel free to make any
          changes to suit your needs.
        </p>
        <p>
          Lastly, if you need to save your data for another session, or to come
          back to it later, don't forget to export your configuration from the
          settings page.
        </p>
      </section>
      <section className="card v75">
        <ExpensesTable />
      </section>
    </>
  );
}

export default Dashboard;
