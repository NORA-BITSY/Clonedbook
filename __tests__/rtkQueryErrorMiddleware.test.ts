import { configureStore, createAction } from '@reduxjs/toolkit';
import { createRtkQueryErrorMiddleware } from '@/redux/middleware/rtkQueryErrorMiddleware';

describe('rtkQueryErrorMiddleware', () => {
  const rejected = createAction<any>('api/executeQuery/rejected');

  function makeStore(deps?: Parameters<typeof createRtkQueryErrorMiddleware>[0]) {
    return configureStore({
      reducer: (s = {}) => s,
      middleware: (getDefault) => getDefault().concat(createRtkQueryErrorMiddleware(deps)),
    });
  }

  const spyWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  const spyError = jest.spyOn(console, 'error').mockImplementation(() => {});

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls onUnauthorized and logs for 401', () => {
    const onUnauthorized = jest.fn();
    const store = makeStore({ onUnauthorized });

    store.dispatch(rejected({ status: 401, data: { message: 'Nope' } }));

    expect(onUnauthorized).toHaveBeenCalledTimes(1);
    expect(spyWarn).toHaveBeenCalledWith('Unauthorized — redirecting to login.');
    expect(spyError).toHaveBeenCalled();
  });

  it('calls onError for generic failures and logs', () => {
    const onError = jest.fn();
    const store = makeStore({ onError });

    store.dispatch(rejected({ status: 500, data: { message: 'Boom' } }));

    expect(onError).toHaveBeenCalledWith(expect.objectContaining({ status: 500 }));
    expect(spyError).toHaveBeenCalled();
  });

  it('passes through unrelated actions', () => {
    const store = makeStore();
    expect(() => store.dispatch({ type: 'not/rejected' })).not.toThrow();
  });

  it('does not call handlers for non-rejected actions', () => {
    const onUnauthorized = jest.fn();
    const onError = jest.fn();
    const store = makeStore({ onUnauthorized, onError });

    store.dispatch({ type: 'some/action', payload: { status: 401 } });

    expect(onUnauthorized).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
    expect(spyWarn).not.toHaveBeenCalled();
    expect(spyError).not.toHaveBeenCalled();
  });

  it('logs even when no handlers provided', () => {
    const store = makeStore();

    store.dispatch(rejected({ status: 403, data: { message: 'Forbidden' } }));

    expect(spyError).toHaveBeenCalledWith('API error:', expect.objectContaining({ status: 403 }));
  });
});