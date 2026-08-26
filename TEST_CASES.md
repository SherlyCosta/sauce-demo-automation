# SauceDemo Playwright Automation Test Cases & Business Requirements

> **Comprehensive specification of automated test cases, user workflows, production business rules, and discovered functional defects for the SauceDemo test suite.**

---

## Executive Summary

| Category | Count | Status / Coverage |
| :--- | :--- | :--- |
| **Total Automated Scenarios** | 57 Scenarios | 100% Automated |
| **Test Modules** | 6 Modules | Login, Inventory, Cart, Checkout, Nav, E2E |
| **Production Business Rules** | 9 Rules Enforced | E-Commerce Validation Rules |
| **Discovered Defects** | 4 Defects | 2 High, 2 Critical Severity |

---

## Table of Contents

1. [Login Module Test Cases](#login-module-test-cases)
2. [Inventory Module Test Cases](#inventory-module-test-cases)
3. [Cart Module Test Cases](#cart-module-test-cases)
4. [Checkout Module Test Cases](#checkout-module-test-cases)
5. [Navigation & Burger Menu Test Cases](#navigation--burger-menu-test-cases)
6. [End-to-End (E2E) User Journeys](#end-to-end-e2e-user-journeys)
7. [Production E-Commerce Business Rules](#production-e-commerce-business-rules)
8. [Discovered Functional Defects Log](#discovered-functional-defects-log)

---

## Login Module Test Cases

**Test Directory**: [`tests/login/`](file:///c:/Users/arya/Desktop/Work/SuaceDemo/tests/login/)

| Test ID | Test Scenario | Description / Execution Steps | Expected Result |
| :--- | :--- | :--- | :--- |
| `TC-LOG-01` | Valid Login | Enter `standard_user` + `secret_sauce` and submit. | Navigates to `/inventory.html` with header `Products`. |

| `TC-LOG-02` | Invalid Username | Enter `invalid_user` + valid password. | Displays error: `"Username and password do not match any user in this service"`. |

| `TC-LOG-03` | Invalid Password | Enter valid username + `invalid_password`. | Displays error: `"Username and password do not match any user in this service"`. |

| `TC-LOG-04` | Invalid Credentials | Enter `invalid_user` + `invalid_password`. | Displays error: `"Username and password do not match any user in this service"`. |

| `TC-LOG-05` | Locked Out User | Enter `locked_out_user` + `secret_sauce`. | Displays error: `"Sorry, this user has been locked out."`. |

| `TC-LOG-06` | Empty Username | Leave username blank and enter password. | Displays validation message: `"Username is required"`. |

| `TC-LOG-07` | Empty Password | Enter username and leave password blank. | Displays validation message: `"Password is required"`. |

| `TC-LOG-08` | All Empty Fields | Submit login form with empty username and password. | Displays validation message: `"Username is required"`. |

| `TC-LOG-09` | Username with Spaces | Enter ` standard_user ` with leading/trailing spaces. | Rejects authentication and displays mismatch error banner. |

| `TC-LOG-10` | Password with Spaces | Enter ` secret_sauce ` with leading/trailing spaces. | Rejects authentication and displays mismatch error banner. |

| `TC-LOG-11` | Logout & Route Guard | Log out via Burger Menu, then attempt direct navigation to `/inventory.html`. | User is logged out, redirected to `/`, and direct access to `/inventory.html` is blocked with `"You can only access '/inventory.html' when you are logged in."`. |

---

## Inventory Module Test Cases

**Test Directory**: [`tests/inventory/`](file:///c:/Users/arya/Desktop/Work/SuaceDemo/tests/inventory/)

| Test ID | Test Scenario | Description / Execution Steps | Expected Result |
| :--- | :--- | :--- | :--- |
| `TC-INV-01` | Page Load & Header | Navigate to `/inventory.html`. | Page loads URL `/inventory.html` and displays title `Products`. |

| `TC-INV-02` | Product Card Count | Inspect product list container. | Exactly 6 product cards are rendered on the grid. |

| `TC-INV-03` | Card Attributes | Inspect title, description, and price elements. | All 6 items display non-empty titles, descriptions, and prices `>$0`. |

| `TC-INV-04` | Image Integrity | Inspect product image `img` tags. | All 6 product images are visible with non-empty `src` URLs. |

| `TC-INV-05` | Add Single Product | Click `Add to cart` on 1 product. | Cart badge increases to `1`; button text changes to `Remove`. |

| `TC-INV-06` | Add Multiple Products | Click `Add to cart` on 3 products. | Cart badge updates to `3`. |

| `TC-INV-07` | Add All Products | Click `Add to cart` on all 6 catalog items. | Cart badge updates to `6`. |

| `TC-INV-08` | Remove Single Product | Click `Remove` on 1 added product. | Cart badge decrements to `0`; button text changes back to `Add to cart`. |

| `TC-INV-09` | Remove Multiple Products | Sequentially remove added products. | Cart badge decrements in real-time. |

| `TC-INV-10` | Remove All Products | Add all items and remove every product. | Cart badge disappears (`0` count). |

| `TC-INV-11` | Product Details View | Click product title text link. | Navigates to `/inventory-item.html`; title, description, price match. |

| `TC-INV-12` | Back to Products | Click `Back to Products` on item detail page. | Navigates back to `/inventory.html`. |

| `TC-INV-13` | Sorting Name A-Z | Select `az` from sort container. | Items sort alphabetically from A to Z. |

| `TC-INV-14` | Sorting Name Z-A | Select `za` from sort container. | Items sort in reverse alphabetical order from Z to A. |

| `TC-INV-15` | Sorting Price Low-High | Select `lohi` from sort container. | Items sort in ascending price order ($7.99 to $49.99). |

| `TC-INV-16` | Sorting Price High-Low | Select `hilo` from sort container. | Items sort in descending price order ($49.99 to $7.99). |

---

## Cart Module Test Cases

**Test Directory**: [`tests/cart/`](file:///c:/Users/arya/Desktop/Work/SuaceDemo/tests/cart/)

| Test ID | Test Scenario | Description / Execution Steps | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| `TC-CRT-01` | Open Cart Page | Click shopping cart icon from header. | Navigates to `/cart.html` with title `Your Cart`. | `[PASS]` |

| `TC-CRT-02` | Product & Price Checks | Verify items added to cart. | Item names (`Backpack`, `Bike Light`), prices (`$29.99`, `$9.99`), and quantities (`1`) match. | `[PASS]` |

| `TC-CRT-03` | Remove Item from Cart | Click `Remove` next to item inside cart. | Item is removed; cart list updates dynamically. | `[PASS]` |

| `TC-CRT-04` | Remove All Items | Remove all products directly inside cart page. | Cart becomes empty with 0 items displayed. | `[PASS]` |

| `TC-CRT-05` | Continue Shopping | Click `Continue Shopping` button inside cart. | Navigates back to `/inventory.html`. | `[PASS]` |

| `TC-CRT-06` | Empty Cart State | View cart when no products were added. | Item count is 0; cart badge is hidden. | `[PASS]` |

| `TC-CRT-07` | Empty Cart Checkout | Click `Checkout` button when cart is empty. | **Business Rule**: User MUST remain on `/cart.html` and be blocked from accessing checkout step one. | `[FAIL - Defect]` |

---

## Checkout Module Test Cases

**Test Directory**: [`tests/checkout/`](file:///c:/Users/arya/Desktop/Work/SuaceDemo/tests/checkout/)

| Test ID | Test Scenario | Description / Execution Steps | Expected Result |
| :--- | :--- | :--- | :--- |
| `TC-CHK-01` | Valid Customer Details | Fill `John`, `Doe`, `12345` and continue. | Navigates to `/checkout-step-two.html` (Overview). |

| `TC-CHK-02` | Input Data Edge Cases | Test Long Strings (50+ chars), Numbers, Alphanumeric, Special Chars. | Form accepts valid string inputs without crashing. |

| `TC-CHK-03` | Missing All Fields | Click `Continue` with empty form. | Banner error: `"Error: First Name is required"`. |

| `TC-CHK-04` | Missing First Name | Leave First Name empty, fill Last Name & Zip. | Banner error: `"Error: First Name is required"`. |

| `TC-CHK-05` | Missing Last Name | Leave Last Name empty, fill First Name & Zip. | Banner error: `"Error: Last Name is required"`. |

| `TC-CHK-06` | Missing Postal Code | Leave Postal Code empty, fill First Name & Last Name. | Banner error: `"Error: Postal Code is required"`. |

| `TC-CHK-07` | Overview Verification | Inspect items, subtotal, tax, and total on step two. | Displays items, subtotal ($39.98), tax > $0, and exact sum (`Subtotal + Tax = Total`). |

| `TC-CHK-08` | Zero-Dollar Order Check | Inspect pricing calculations on step two. | **Business Rule**: Subtotal, tax, and total must be > $0. Never display $0 order totals. |

| `TC-CHK-09` | Finish Checkout | Click `Finish` button on step two overview. | Navigates to `/checkout-complete.html` with title `Checkout: Complete!`. |

| `TC-CHK-10` | Order Confirmation | Inspect header and image on completion page. | Header: `"Thank you for your order!"`; Pony Express image is rendered. |

| `TC-CHK-11` | Back Home | Click `Back Home` button on completion page. | Navigates back to `/inventory.html`. |

| `TC-CHK-12` | Cancel Step 1 | Click `Cancel` on checkout step one. | Navigates back to `/cart.html`. |

| `TC-CHK-13` | Cancel Step 2 | Click `Cancel` on checkout step two overview. | Navigates back to `/inventory.html`. |

---

## Navigation & Burger Menu Test Cases

**Test Directory**: [`tests/navigation/`](file:///c:/Users/arya/Desktop/Work/SuaceDemo/tests/navigation/)

| Test ID | Test Scenario | Description / Execution Steps | Expected Result |
| :--- | :--- | :--- | :--- |
| `TC-NAV-01` | Full Workflow Chain | `Inventory` -> `Cart` -> `Continue` -> `Cart` -> `Checkout` -> `Overview` -> `Finish` -> `Back Home`. | Every page transition completes seamlessly. |

| `TC-NAV-02` | Open/Close Sidebar | Click burger icon, then click cross `X` icon. | Sidebar slides open and closes cleanly. |

| `TC-NAV-03` | Sidebar All Items | Click `All Items` link in burger menu. | Navigates to `/inventory.html`. |

| `TC-NAV-04` | Sidebar Logout | Click `Logout` link in burger menu. | Logs out session and redirects to `/`. |

| `TC-NAV-05` | Reset App State | Add items to cart, then click `Reset App State`. | Clears cart items and resets badge count to 0 in real-time. |

| `TC-NAV-06` | External About Link | Inspect `About` link inside burger menu. | Link target `href` points to `https://saucelabs.com/`. |

---

## End-to-End (E2E) User Journeys

**Test Directory**: [`tests/e2e/`](file:///c:/Users/arya/Desktop/Work/SuaceDemo/tests/e2e/)

| Flow ID | Scenario | Execution Steps | Expected Outcome | Status |
| :--- | :--- | :--- | :--- | :--- |
| `E2E Flow 1` | Single Item Purchase | Login -> Add 1 Item -> Cart -> Checkout -> Finish. | Order complete confirmation `"Thank you for your order!"`. | `[PASS]` |

| `E2E Flow 2` | Dynamic Multi-Item Flow | Login -> Add 5 Products -> Remove 3 -> Continue Shopping -> Add 1 -> Checkout -> Finish. | Successfully completes checkout for remaining 3 items with Thank You confirmation. | `[PASS]` |

| `E2E Flow 3` | Purchase All Products | Add all 6 catalog products -> Checkout -> Finish. | Successfully places order for all 6 products. | `[PASS]` |

| `E2E Flow 4` | Empty Cart Post-Removal | Add items -> Remove every item from cart -> Attempt Checkout. | **Business Rule**: System MUST block proceeding to checkout and keep user on `/cart.html`. | `[FAIL - Defect]` |

---

## Production E-Commerce Business Rules

These rules represent standard commercial e-commerce constraints enforced by the automation suite:

| Rule # | Target Area | Business Rule Requirement |
| :---: | :--- | :--- |
| **1** | Cart Navigation | A user must **not** be able to proceed to checkout when the cart is empty. |

| **2** | Cart UI Controls | The Checkout button should be disabled or the user should remain on the Cart page when attempting checkout with an empty cart. |

| **3** | Route Protection | The Checkout Information page (`/checkout-step-one.html`) should **not** be accessible when the cart is empty. |

| **4** | Order Integrity | An order must always contain **at least one product**. |

| **5** | Pricing Calculations | Checkout Overview should **never** display a valid order with `Subtotal = $0`, `Tax = $0`, `Total = $0`. |

| **6** | Order Completion | The Finish button must **not** complete an order if there are no products. |

| **7** | Confirmation Access | The Thank You / Order Complete page (`/checkout-complete.html`) must **never** be displayed unless at least one product has been successfully purchased. |

| **8** | Cart Badge State | Cart badge count should disappear (`0` items) when the cart becomes empty. |

| **9** | Post-Clear Validation | After removing the last product from the cart, the application should prevent order placement. |

---

## Discovered Functional Defects Log

Execution of the automated test suite against standard SauceDemo identified **4 production business rule defects**:

> [!WARNING]
> ### DEFECT REPORT 1: Empty Cart Checkout Proceed Vulnerability
> - **Module**: Cart Module (`tests/cart/`)
> - **Severity**: `High`
> - **Expected Result**: User must remain on `/cart.html` and be blocked from navigating to checkout when cart is empty.
> - **Actual Result**: User was allowed to navigate to checkout step one: `https://www.saucedemo.com/checkout-step-one.html`
> - **Recommendation**: Disable Checkout button when cart item count is `0` or display an inline validation banner.

> [!WARNING]
> ### DEFECT REPORT 2: Unrestricted Direct Access to Checkout Information Page With Empty Cart
> - **Module**: Checkout Module (`tests/checkout/`)
> - **Severity**: `High`
> - **Expected Result**: Direct access to `/checkout-step-one.html` with an empty cart must be redirected to `/cart.html`.
> - **Actual Result**: Application permitted direct access to checkout page without cart items.
> - **Recommendation**: Implement route guard middleware checking cart item session count before rendering checkout step one.

> [!CAUTION]
> ### DEFECT REPORT 3: Unverified Access to Thank You / Order Complete Page Without Purchase
> - **Module**: Checkout Module (`tests/checkout/`)
> - **Severity**: `Critical`
> - **Expected Result**: Order Complete page (`/checkout-complete.html`) must never be accessible without a valid completed transaction.
> - **Actual Result**: Application rendered Order Complete page directly without any item purchase.
> - **Recommendation**: Require a valid completed order transaction ID in session before granting access to `/checkout-complete.html`.

> [!CAUTION]
> ### DEFECT REPORT 4: Order Placement Allowed After Cart Cleared
> - **Module**: E2E / Checkout Module (`tests/e2e/`)
> - **Severity**: `Critical`
> - **Expected Result**: After removing all items from cart, proceeding to checkout must be blocked and user kept on `/cart.html`.
> - **Actual Result**: Application permitted user to proceed to checkout after clearing cart (`/checkout-step-one.html`).
> - **Recommendation**: Re-validate cart count on checkout button action and prevent navigation if cart item count is zero.
