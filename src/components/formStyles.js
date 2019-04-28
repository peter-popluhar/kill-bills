import styled from 'styled-components'
import cssVar from './../utils/globalVariables';

export const FormSkeleton = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    flex-wrap: wrap;
    width: 100%;

    @media ${cssVar.smMin} {
        flex-direction: row;
    }
`

export const FormSkeletonItem = styled.div`
    flex: 0 0 100%;
    margin-bottom: 20px;

    @media ${cssVar.smMin} {
        flex: 0 0 48%;
    }

    &:first-child {

        @media ${cssVar.smMin} {
            margin-right: 2%;
        }

        > div {
            width: 100%;
        }

    }

    &:last-child {
        display: flex;
        align-items: baseline;
        justify-content: space-between;

        @media ${cssVar.smMin} {
            margin-left: 2%;
        }

        > div {
            display: flex;
            flex: 0 1 calc(100% - 50px);
        }
    }
`
