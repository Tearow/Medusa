import Push, { PushNotification } from 'push.js';
import icon from '../static/images/ico/favicon-196.png';

Push.config({
    /* Show notification in a different way?
    fallback(payload) {
        const { title, body, tag } = payload;
    } */
});

/**
 * Request notifications permission.
 *
 * @returns {Promise} User's response to the permission request
 */
export const requestPermission = Push.Permission.request;

/**
 * Check notifications permission.
 *
 * Possible return values:
 * - `'default'`: The user hasn't been asked for permission yet, so notifications won't be displayed.
 * - `'granted'`: The user has granted permission to display notifications, after having been asked previously.
 * - `'denied'`: The user has explicitly declined permission to show notifications.
 *
 * @returns {string} See above
 */
export const checkPermission = Push.Permission.get;

/**
 * Whether or not the user has given permission to show notifications.
 *
 * @returns {boolean} Whether Permissions are allowed or denied
 */
export const hasPermission = Push.Permission.has;

/**
 * Display a notification to the user.
 *
 * @param {string} type - Notification type (`notice`, `info`, `success`, or `error`).
 * @param {string} title - Notification title.
 * @param {string} message - Notification body.
 * @param {(string|number)} tag - Unique notification ID to prevent duplicate desktop notifications.
 * @returns {Promise<PushNotification>} A notification object
 */
export const displayNotification = (type, title, message, tag) => {
    const body = String(message)
        .replace(/<br[\s/]*(?:\s[^>]*)?>/ig, '\n') // eslint-disable-line unicorn/no-unsafe-regex
        .replace(/<[/]?b(?:\s[^>]*)?>/ig, '*') // eslint-disable-line unicorn/no-unsafe-regex
        .replace(/<i(?:\s[^>]*)?>/ig, '[') // eslint-disable-line unicorn/no-unsafe-regex
        .replace(/<[/]i>/ig, ']') // eslint-disable-line unicorn/no-unsafe-regex
        .replace(/<(?:[/]?ul|\/li)(?:\s[^>]*)?>/ig, '') // eslint-disable-line unicorn/no-unsafe-regex
        .replace(/<li(?:\s[^>]*)?>/ig, '\n* '); // eslint-disable-line unicorn/no-unsafe-regex

    return Push.create(title, {
        body,
        tag,
        icon,
        onClick() {
            // @TODO: Display the full notification in a dialog?
            this.close();
        }
    }).catch(() => {
        // User denied notifications.
    });
};
