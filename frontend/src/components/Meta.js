import React from "react";
import { Helmet } from "react-helmet";
const Meta = ({ title, description, keyword }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keyword" content={keyword} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: "Welcome to proshop",
  description: "We sell the best products",
  keyword: "Electronics Buy Cheap electronics",
};
export default Meta;
