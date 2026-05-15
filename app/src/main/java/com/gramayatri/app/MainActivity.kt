package com.gramayatri.app

import android.annotation.SuppressLint
import android.os.Bundle
import android.view.View
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Hide the default ActionBar (we have our own topbar in HTML)
        supportActionBar?.hide()

        // Make status bar transparent so app feels full-screen
        window.decorView.systemUiVisibility = (
            View.SYSTEM_UI_FLAG_LAYOUT_STABLE or
            View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
        )

        setContentView(R.layout.activity_main)
        webView = findViewById(R.id.webview)

        // ── WebView settings ──────────────────────────────────────────
        webView.settings.apply {
            javaScriptEnabled      = true   // Required for app.js
            domStorageEnabled      = true   // Allows localStorage if needed later
            cacheMode              = WebSettings.LOAD_DEFAULT
            mixedContentMode       = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
            useWideViewPort        = true
            loadWithOverviewMode   = true
            allowFileAccessFromFileURLs = true
            allowUniversalAccessFromFileURLs = true
        }

        // ── WebViewClient: keep navigation inside the WebView ─────────
        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(
                view: WebView?,
                request: WebResourceRequest?
            ): Boolean = false   // Let WebView handle all URLs
        }

        // ── WebChromeClient: enables console.log in Logcat ────────────
        webView.webChromeClient = WebChromeClient()

        // ── Load the app from assets ──────────────────────────────────
        webView.loadUrl("file:///android_asset/index.html")
    }

    // ── Handle Android back button ────────────────────────────────────
    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}
