import { GetServerSideProps } from "next";
import { useContext, useEffect } from "react";
import { Can } from "../components/Can";
import { AuthContext } from "../contexts/AuthContext";
import { useCan } from "../hooks/useCan";
import { setupApiClient } from "../services/api";
import { api } from "../services/apiClient";
import { withSSRAuth } from "../utils/withSSRAuth";

export default function Dashboard() {
  const { user, signOut } = useContext(AuthContext);
  const userCanSeeMetrics = useCan({
    permissions: ["metrics.create"],
  });

  useEffect(() => {
    api
      .get("/me")
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {});
  }, []);
  return (
    <>
      <h1> {user?.email} </h1>
      <button onClick={signOut}>Sign out</button>
      {/* Usando hook */}
      {userCanSeeMetrics && <div>Metricas</div>}
      {/* Usando componente */}
      <Can permissions={["metrics.list"]}>
        <div>Metricas 2</div>
      </Can>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withSSRAuth(
  async (ctx) => {
    const apiClient = setupApiClient(ctx);
    const response = await apiClient.get("/me");

    return {
      props: {},
    };
  }
);
