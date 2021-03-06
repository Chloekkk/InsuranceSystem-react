import { useReducer, useEffect } from 'react';

function reducer(state, action) {
    switch (action.type) {
        case 'LOADING':
            return {
                loading: true,
                data: null,
                error: null
            };
        case 'SUCCESS':
            return {
                loading: false,
                data: action.data,
                error: null
            };
        case 'ERROR':
            return {
                loading: false,
                data: null,
                error: action.error
            };
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}

export const useAsync = (callback, setData, deps = [], skip = false) => {
    const [state, dispatch] = useReducer(reducer, {
        loading: false,
        data: null,
        error: false
    });

    const fetchData = async () => {
        dispatch({ type: 'LOADING' });
        try {
            const data = await callback();
            dispatch({ type: 'SUCCESS', data });
            if (setData != null)
                setData(data);
        } catch (e) {
            dispatch({ type: 'ERROR', error: e });
        }
    };

    useEffect(() => {
        if (skip)
        {
            console.log("i skip well!");
            return;
        }
        fetchData();
        console.log("i dont skip");
        // eslint 설정을 다음 줄에서만 비활성화
        // eslint-disable-next-line
    }, deps);

    console.log(state);

    return [state, fetchData];
}

export default useAsync;
