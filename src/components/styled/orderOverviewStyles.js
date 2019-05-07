import styled from 'styled-components'
import cssVar from './../../utils/globalVariables';

export const OrderOverviewSkeleton = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;

    @media ${cssVar.smMin} {
        flex-direction: row;
    }
`

export const OrderOverviewSkeletonItem = styled.div`

    &:last-child {
        display: flex;
        flex-direction: column;
        justify-content: space-around;

        button {
          margin-top: 20px;
        }
    }
`
