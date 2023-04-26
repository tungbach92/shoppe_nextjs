import React, {ReactNode} from "react";
import DetailContainer from "../../components/Detail/DetailContainer";
import Layout from "@/components/Layout/Layout";

export default function ProductDetail() {
  return (
    <DetailContainer></DetailContainer>
  );
}

ProductDetail.getLayout = function (page: ReactNode) {
  return <Layout>{page}</Layout>
}
