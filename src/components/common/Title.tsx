// src/components/common/Title.tsx

import * as pkg from "react-helmet-async";

const { Helmet } = pkg;

const Title = ({ children  }) => {
  return (
    <Helmet>
      <title>{children}</title>
    </Helmet>
  );
};

export default Title;
