function normalizeSegmentLabel(segment) {
    return String(segment || "")
        .replace(/[-_]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function safeEncodePath(path) {
    return String(path || "")
        .split("/")
        .map((segment, index) => {
            if (!segment && index === 0) return "";
            return encodeURIComponent(decodeURIComponent(segment || ""));
        })
        .join("/");
}

export function createBreadcrumbItems(config) {
    const rawItems = Array.isArray(config?.items) ? config.items : [];
    return rawItems
        .filter((item) => item && item.label)
        .map((item, index) => {
            const isLast = index === rawItems.length - 1;
            const label = String(item.label || "").trim() || normalizeSegmentLabel(item.segment || item.href || "");
            const href = item.href ? safeEncodePath(item.href) : "";
            return {
                label,
                href,
                title: item.title || label,
                current: typeof item.current === "boolean" ? item.current : isLast,
                iconHtml: item.iconHtml || ""
            };
        });
}

export function createBreadcrumbItemsFromPath(pathname, options = {}) {
    const trimmed = String(pathname || "").replace(/^[./]+/, "").replace(/\.html$/i, "");
    const segments = trimmed.split("/").filter(Boolean);
    const baseItems = Array.isArray(options.baseItems) ? options.baseItems : [];
    const items = [...baseItems];
    let accumulated = "";
    segments.forEach((segment, index) => {
        accumulated += (accumulated ? "/" : "") + segment;
        const isLast = index === segments.length - 1;
        items.push({
            label: normalizeSegmentLabel(segment),
            href: isLast ? "" : accumulated + ".html",
            current: isLast
        });
    });
    return createBreadcrumbItems({ items });
}

function moveFocusWithinBreadcrumb(container, currentTarget, direction) {
    const links = Array.from(container.querySelectorAll(".dlg-breadcrumb-link"));
    if (!links.length) return;
    const currentIndex = links.indexOf(currentTarget);
    if (currentIndex < 0) return;
    const nextIndex = direction === "next"
        ? Math.min(currentIndex + 1, links.length - 1)
        : Math.max(currentIndex - 1, 0);
    links[nextIndex].focus();
}

export function renderBreadcrumb(container, config) {
    if (!container) return null;
    const items = createBreadcrumbItems(config);
    if (!items.length) {
        container.innerHTML = "";
        return null;
    }

    const nav = document.createElement("nav");
    nav.className = "dlg-breadcrumb-nav";
    nav.setAttribute("aria-label", config?.ariaLabel || "breadcrumb");

    const list = document.createElement("ol");
    list.className = "dlg-breadcrumb";

    items.forEach((item, index) => {
        const li = document.createElement("li");
        li.className = "dlg-breadcrumb-item";

        if (index > 0) {
            const separator = document.createElement("span");
            separator.className = "dlg-breadcrumb-separator";
            separator.setAttribute("aria-hidden", "true");
            separator.textContent = config?.separator || "/";
            li.appendChild(separator);
        }

        if (item.current || !item.href) {
            const current = document.createElement("span");
            current.className = "dlg-breadcrumb-current";
            current.setAttribute("aria-current", "page");
            current.textContent = item.label;
            li.appendChild(current);
        } else {
            const link = document.createElement("a");
            link.className = "dlg-breadcrumb-link";
            link.href = item.href;
            link.title = item.title;
            link.dataset.breadcrumbIndex = String(index);
            link.innerHTML = (item.iconHtml ? '<span class="dlg-breadcrumb-icon">' + item.iconHtml + "</span>" : "") + '<span>' + item.label + '</span>';
            link.addEventListener("keydown", (event) => {
                if (event.key === "ArrowRight") {
                    event.preventDefault();
                    moveFocusWithinBreadcrumb(nav, link, "next");
                }
                if (event.key === "ArrowLeft") {
                    event.preventDefault();
                    moveFocusWithinBreadcrumb(nav, link, "prev");
                }
                if (event.key === "Enter" || event.key === " ") {
                    link.click();
                }
            });
            li.appendChild(link);
        }

        list.appendChild(li);
    });

    nav.appendChild(list);
    container.innerHTML = "";
    container.appendChild(nav);
    return nav;
}

export function runBreadcrumbUnitTests() {
    const results = [];
    const pathItems = createBreadcrumbItemsFromPath("setting/users-management.html", {
        baseItems: [{ label: "Home", href: "../home.html" }]
    });
    results.push(pathItems.length === 3);
    results.push(pathItems[0].label === "Home");
    results.push(pathItems[2].current === true);

    const customItems = createBreadcrumbItems({
        items: [
            { label: "Home", href: "../home.html" },
            { label: "Users", href: "./users.html" },
            { label: "Detail", current: true }
        ]
    });
    results.push(customItems[1].href === "./users.html");
    results.push(customItems[2].current === true);

    return results.every(Boolean);
}
