import { fetch } from '~/fetch';
import {
    makeFetchPage,
    makeUpdateItem,
    makeUpdateUntil,
    makeDeleteItem,
} from '~/api-store';

export const UPDATE_LINODES = '@@linodes/UPDATE_LINODES';
export const UPDATE_LINODE = '@@linodes/UPDATE_LINODE';
export const DELETE_LINODE = '@@linodes/DELETE_LINODE';

export const fetchLinodes = makeFetchPage(
    UPDATE_LINODES, 'linodes');
export const updateLinode = makeUpdateItem(
    UPDATE_LINODE, 'linodes', 'linode');
export const updateLinodeUntil = makeUpdateUntil(
    UPDATE_LINODE, 'linodes', 'linode');
export const deleteLinode = makeDeleteItem(
    DELETE_LINODE, 'linodes');

function linodeAction(id, action, temp, expected, timeout = undefined) {
  return async (dispatch, getState) => {
    const state = getState();
    const { token } = state.authentication;
    dispatch({ type: UPDATE_LINODE, linode: { id, state: temp } });
    await fetch(token, `/linodes/${id}/${action}`, { method: 'POST' });
    await dispatch(updateLinodeUntil(id, l => l.state === expected, timeout));
  };
}

export function powerOnLinode(id, timeout = undefined) {
  return linodeAction(id, 'boot', 'booting', 'running', timeout);
}

export function powerOffLinode(id, timeout = undefined) {
  return linodeAction(id, 'shutdown', 'shutting_down', 'offline', timeout);
}

export function rebootLinode(id, timeout = undefined) {
  return linodeAction(id, 'reboot', 'rebooting', 'running', timeout);
}
