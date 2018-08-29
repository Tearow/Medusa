import icon from '../static/images/ico/favicon-196.png';

/**
 * Request notifications permission.
 *
 * @returns {Promise} User's response to the permission request
 */
const requestPermission = () => {
    if ('Notification' in window && 'requestPermission' in Notification) {
        return Notification.requestPermission();
    }
    return Promise.reject(new Error('API is unavailable'));
};

/**
 * Check notifications permission.
 *
 * Possible return values:
 * - `'default'`: The user hasn't been asked for permission yet, so notifications won't be displayed.
 * - `'granted'`: The user has granted permission to display notifications, after having been asked previously.
 * - `'denied'`: The user has explicitly declined permission to show notifications.
 * - `undefined`: The browser API isn't available.
 *
 * @returns {string|undefined} See above
 */
const checkPermission = () => {
    if ('Notification' in window && 'permission' in Notification) {
        return Notification.permission;
    }
    return undefined;
};

/**
 * Display a notification to the user.
 *
 * @param {string} type - Notification type (`notice`, `info`, `success`, or `error`).
 * @param {string} title - Notification title.
 * @param {string} message - Notification body.
 * @param {(string|number)} tag - Unique notification ID to prevent duplicate desktop notifications.
 * @returns {Notification|boolean} - The notification object or false if the notification wasn't displayed.
 */
const displayNotification = (type, title, message, tag) => {
    if (!('Notification' in window)) {
        // This browser does not support system notifications
        // @TODO: Alert the user in a different way?
        return false;
    }

    if (checkPermission() === 'denied') {
        // The user has denied notifications.
        // @TODO: Alert the user in a different way?
        return false;
    }

    if (checkPermission() === 'default') {
        // The user has yet to grant permission.
        // @TODO: Request permission, wait for the response and continue accordingly?
        return false;
    }

    const body = String(message)
        .replace(/<br[\s/]*(?:\s[^>]*)?>/ig, '\n') // eslint-disable-line unicorn/no-unsafe-regex
        .replace(/<[/]?b(?:\s[^>]*)?>/ig, '*') // eslint-disable-line unicorn/no-unsafe-regex
        .replace(/<i(?:\s[^>]*)?>/ig, '[') // eslint-disable-line unicorn/no-unsafe-regex
        .replace(/<[/]i>/ig, ']') // eslint-disable-line unicorn/no-unsafe-regex
        .replace(/<(?:[/]?ul|\/li)(?:\s[^>]*)?>/ig, '') // eslint-disable-line unicorn/no-unsafe-regex
        .replace(/<li(?:\s[^>]*)?>/ig, '\n* '); // eslint-disable-line unicorn/no-unsafe-regex

    const notice = new Notification(title, {
        body,
        tag,
        icon,
        // @TODO: This can be used to display an image within the notification
        image: undefined
    });

    // Notification clicked
    const onClick = () => {
        // @TODO: Display the full notification in a dialog?
    };
    // Notification closed
    const onClose = () => {};

    if ('NotificationEvent' in window) {
        notice.addEventListener('notificationclick', onClick);
        notice.addEventListener('close', onClose);
    } else if ('addEventListener' in notice) {
        notice.addEventListener('click', onClick);
        notice.addEventListener('close', onClose);
    } else {
        notice.onclick = onClick; // eslint-disable-line unicorn/prefer-add-event-listener
        notice.onclose = onClose;
    }

    return notice;
};

// @FIXME: Requesting permission without a user action is a violation.
requestPermission();

export {
    checkPermission,
    displayNotification,
    requestPermission
};
