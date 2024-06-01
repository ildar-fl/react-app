import { useEffect, useRef, useState } from 'react';
import { isEqual } from 'lodash';

type FuncRequestType =
  | ((...args: any[]) => Promise<any>)
  | 0
  | undefined
  | null
  | false;

type FuncRequestProps = any[];

interface IUseRequestReturnProps<Data> {
  isLoading: boolean;
  data: null | Data;
  error: null | any;
}

const INITIAL_PROPS: any[] = [];

const useRequest = <Data>(
  func: FuncRequestType,
  props: FuncRequestProps = INITIAL_PROPS
): IUseRequestReturnProps<Data> => {
  const deps = [func, ...props];
  const prevProps = useRef<any[] | null>(null);
  const abortControllerRef = useRef(new AbortController());
  const requestRef = useRef<null | Promise<any>>(null);

  const [data, setData] = useState<null | Data>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEqual(deps, prevProps.current)) {
      if (requestRef.current) {
        abortControllerRef.current.abort();
        requestRef.current = null;
      }

      if (!!func) {
        abortControllerRef.current = new AbortController();
        requestRef.current = func(...props, {
          signal: abortControllerRef.current.signal,
        });
        requestRef.current
          .then((data) => {
            if (!abortControllerRef.current.signal.aborted) {
              setData(data);
              setError(null);
              requestRef.current = null;
            }
          })
          .catch((error) => {
            if (!abortControllerRef.current.signal.aborted) {
              setError(error);
              requestRef.current = null;
            }
          });
      } else {
        setData(null);
        setError(null);
      }

      prevProps.current = deps;
    }
  });

  return {
    isLoading: !!requestRef.current,
    data,
    error,
  };
};

export { useRequest };
