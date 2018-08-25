import PNotify from 'pnotify/lib/es/PNotify';
import 'pnotify/lib/es/PNotifyDesktop'; // eslint-disable-line import/no-unassigned-import
import 'pnotify/lib/es/PNotifyButtons'; // eslint-disable-line import/no-unassigned-import
import 'pnotify/lib/es/PNotifyHistory'; // eslint-disable-line import/no-unassigned-import
import 'pnotify/dist/PNotifyBrightTheme.css'; // eslint-disable-line import/no-unassigned-import
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved, import/extensions
import MedusaIcon from 'url-loader!../static/images/ico/favicon-196.png';

// Configure defaults
PNotify.defaults = {
    ...PNotify.defaults,
    addClass: 'stack-bottomright',
    delay: 5000,
    hide: true,
    shadow: false,
    styling: 'bootstrap3',
    width: '340px',
    stack: {
        dir1: 'up',
        dir2: 'left',
        firstpos1: 25,
        firstpos2: 25
    }
};
PNotify.modules.Desktop.defaults = {
    ...PNotify.modules.Desktop.defaults,
    desktop: true,
    fallback: true,
    icon: MedusaIcon
};
PNotify.modules.Buttons.defaults.closer = true;
PNotify.modules.Buttons.defaults.closerHover = false;
PNotify.modules.History.defaults.maxInStack = 5;

/**
 * Display a notification to the user.
 * @param {string} type - Notification type (`notice`, `info`, `success`, or `error`).
 * @param {string} title - Notification title.
 * @param {string} message - Notification body.
 * @param {(string|number)} id - Unique notification ID to prevent duplicate desktop notifications.
 */
const displayNotification = (type, title, message, id) => {
    const text = String(message)
        .replace(/<br[\s/]*(?:\s[^>]*)?>/ig, '\n') // eslint-disable-line unicorn/no-unsafe-regex
        .replace(/<[/]?b(?:\s[^>]*)?>/ig, '*') // eslint-disable-line unicorn/no-unsafe-regex
        .replace(/<i(?:\s[^>]*)?>/ig, '[') // eslint-disable-line unicorn/no-unsafe-regex
        .replace(/<[/]i>/ig, ']') // eslint-disable-line unicorn/no-unsafe-regex
        .replace(/<(?:[/]?ul|\/li)(?:\s[^>]*)?>/ig, '') // eslint-disable-line unicorn/no-unsafe-regex
        .replace(/<li(?:\s[^>]*)?>/ig, '\n* '); // eslint-disable-line unicorn/no-unsafe-regex

    PNotify.alert({
        type,
        title,
        text,
        modules: {
            Desktop: {
                tag: id
            }
        }
    });
};

PNotify.modules.Desktop.permission();

export {
    displayNotification
};
