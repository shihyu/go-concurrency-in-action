// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded "><a href="index.html"><strong aria-hidden="true">1.</strong> 開篇詞 | 想吃透Go併發編程，你得這樣學！</a></li><li class="chapter-item expanded "><a href="02.html"><strong aria-hidden="true">2.</strong> 01 | Mutex：如何解決資源併發訪問問題？</a></li><li class="chapter-item expanded "><a href="03.html"><strong aria-hidden="true">3.</strong> 02 | Mutex：庖丁解牛看實現</a></li><li class="chapter-item expanded "><a href="04.html"><strong aria-hidden="true">4.</strong> 03｜Mutex：4種易錯場景大盤點</a></li><li class="chapter-item expanded "><a href="05.html"><strong aria-hidden="true">5.</strong> 04｜ Mutex：駭客編程，如何拓展額外功能？</a></li><li class="chapter-item expanded "><a href="06.html"><strong aria-hidden="true">6.</strong> 05｜ RWMutex：讀寫鎖的實現原理及避坑指南</a></li><li class="chapter-item expanded "><a href="07.html"><strong aria-hidden="true">7.</strong> 06 | WaitGroup：協同等待，任務編排利器</a></li><li class="chapter-item expanded "><a href="08.html"><strong aria-hidden="true">8.</strong> 07 | Cond：條件變量的實現機制及避坑指南</a></li><li class="chapter-item expanded "><a href="09.html"><strong aria-hidden="true">9.</strong> 08 | Once：一個簡約而不簡單的併發原語</a></li><li class="chapter-item expanded "><a href="10.html"><strong aria-hidden="true">10.</strong> 09 | map：如何實現線程安全的map類型？</a></li><li class="chapter-item expanded "><a href="11.html"><strong aria-hidden="true">11.</strong> 10 | Pool：性能提升大殺器</a></li><li class="chapter-item expanded "><a href="12.html"><strong aria-hidden="true">12.</strong> 11 | Context：信息穿透上下文</a></li><li class="chapter-item expanded "><a href="13.html"><strong aria-hidden="true">13.</strong> 12 | atomic：要保證原子操作，一定要使用這幾種方法</a></li><li class="chapter-item expanded "><a href="14.html"><strong aria-hidden="true">14.</strong> 13 | Channel：另闢蹊徑，解決併發問題</a></li><li class="chapter-item expanded "><a href="15.html"><strong aria-hidden="true">15.</strong> 14 | Channel：透過代碼看典型的應用模式</a></li><li class="chapter-item expanded "><a href="16.html"><strong aria-hidden="true">16.</strong> 15 | 內存模型：Go如何保證併發讀寫的順序？</a></li><li class="chapter-item expanded "><a href="17.html"><strong aria-hidden="true">17.</strong> 16 | Semaphore：一篇文章搞懂信號量</a></li><li class="chapter-item expanded "><a href="18.html"><strong aria-hidden="true">18.</strong> 17 | SingleFlight 和 CyclicBarrier：請求合併和循環柵欄該怎麼用？</a></li><li class="chapter-item expanded "><a href="19.html"><strong aria-hidden="true">19.</strong> 18 | 分組操作：處理一組子任務，該用什麼併發原語？</a></li><li class="chapter-item expanded "><a href="20.html"><strong aria-hidden="true">20.</strong> 19 | 在分佈式環境中，Leader選舉、互斥鎖和讀寫鎖該如何實現？</a></li><li class="chapter-item expanded "><a href="21.html"><strong aria-hidden="true">21.</strong> 20 | 在分佈式環境中，隊列、柵欄和STM該如何實現？</a></li><li class="chapter-item expanded "><a href="22.html"><strong aria-hidden="true">22.</strong> 結束語 | 再聊Go併發編程的價值和精進之路</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0].split("?")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
