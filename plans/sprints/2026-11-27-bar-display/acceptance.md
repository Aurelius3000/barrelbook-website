# Local acceptance criteria

| Scenario | Required result |
| --- | --- |
| Setup | Alice sees 103 eligible whole-shelf bottles and 78 open. A flight publishes exactly the selected eligible bottles. Empty selections cannot start. |
| Disclosure | In a flight with both optional fields disabled, every returned card has only the expected guest keys. Bob’s private bottle and Alice’s private data are absent. Five stars disappears with ratings. Excluding Type removes the type filters. Excluded fields are absent in both owner preview and guest payload. |
| Photos | Startup waits for all included preview images to decode. A failed photo preview blocks Start. The guest retrieves a metadata-stripped WebP by a display-scoped opaque ID. Direct private paths stay inaccessible. |
| Device handoff | Two signed-in tabs sign out before activation. Guest sessions carry an HttpOnly cookie. Opening the site without that cookie cannot read the shelf. Both original tabs require sign-in after exit. |
| Exit and recovery | Five incorrect PINs trigger cooldown. The per-display PIN ends the session. Bob cannot recover Alice’s display. Fresh Alice recovery ends at the login screen. |
| Absolute expiry | The server issues a deadline eight hours from activation. At cutoff, cards and photos are denied, and a delayed status reply cannot redisplay expired guest content. Tests shorten only a disposable display-session deadline. |
| Showcase | Automatic advance at the configured interval, manual selection and indefinite pause, wraparound navigation, and a full new interval on resume. |
| Browse | All 103 bottles fit eleven full-HD pages. The last holds three. Filtering and closing a fact card retain context. Tablet shows six bottles per page without page-wide overflow. |
| Viewer | Tapping Weller pauses on the showcase. Enlarge photo shows the complete bottle at Fit, with no single-photo counter. Booker’s shows its recorded release, age, 125.7 proof and three photos. Navigation wraps and resets zoom. Tab and Shift+Tab remain in the viewer. Escape returns focus to the opener. |
| Return and isolation | Manual return and 60-second idle return preserve the selected bottle. Interaction resets idle time. Reduced motion starts and returns paused. Guest browsing makes no owner reads or mutations. Alice’s bottle document versions match before and after privacy tests. |

Use the browser scripts and unit checks in [the verification record](evidence.md). Fullscreen and wake-lock behavior on physical display hardware and real identity-provider sign-in belong to a subsequent device or hosted acceptance pass.
