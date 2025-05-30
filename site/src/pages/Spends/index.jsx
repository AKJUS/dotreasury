import styled from "styled-components";
import { space_y } from "../../styles/tailwindcss";
import TreasurySpendsTable from "./TreasurySpendsTable";

const Wrapper = styled.div`
  color: var(--textPrimary);
  ${space_y(16)}
`;

export default function Spends() {
  return (
    <Wrapper>
      <TreasurySpendsTable />
    </Wrapper>
  );
}
