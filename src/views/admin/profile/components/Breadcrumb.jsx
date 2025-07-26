import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";

var Breadcrumb = function (_a) {
    var pageName = _a.pageName;
    return React.createElement(
        "div",
        {
            className:
                "mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        },
        React.createElement(
            "h2",
            {
                className:
                    "text-title-md2 font-semibold text-black dark:text-white",
            },
            pageName,
        ),
        // React.createElement(
        //     "nav",
        //     null,
        //     React.createElement(
        //         "ol",
        //         { className: "flex items-center gap-2" },
        //         React.createElement(
        //             "li",
        //             null,
        //             React.createElement(
        //                 Link,
        //                 { className: "font-medium", to: "/" },
        //                 "Dashboard /",
        //             ),
        //         ),
        //         React.createElement(
        //             "li",
        //             { className: "font-medium text-primary" },
        //             pageName,
        //         ),
        //     ),
        // ),
    );
};
export default Breadcrumb;
