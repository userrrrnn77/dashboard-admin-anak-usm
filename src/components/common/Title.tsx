// src/components/common/Title.tsx

import * as pkg from "react-helmet-async";

const { Helmet } = pkg;

interface TitleProps {
  children: string;
}

const Title = ({ children }: TitleProps) => {
  // Binding element 'children' implicitly has an 'any' type.
  return (
    <Helmet>
      <title>{children}</title>
    </Helmet>
  );
};

export default Title;
