# YetiTerm

<p align="center">
  <img src="public/logo.png" alt="YetiTerm Logo" width="128" height="128">
</p>

<p align="center">
  <strong>Modern, High-Performance SSH Client & Terminal Workspace</strong><br/>
  Designed for System Administrators, Developers, and DevOps Engineers.
</p>

<p align="center">
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue?style=flat-square">
  &nbsp;
  <img alt="Platform" src="https://img.shields.io/badge/Platform-macOS%20%7C%20Windows%20%7C%20Linux-brightgreen?style=flat-square">
  &nbsp;
  <img alt="License" src="https://img.shields.io/badge/License-GPL--3.0-orange?style=flat-square">
</p>

---

## 🚀 Overview

**YetiTerm** is a modern, high-performance SSH client and terminal workspace engineered to provide seamless infrastructure management across local and remote environments. Built on top of Electron, React, and xterm.js, YetiTerm combines a rich user interface with robust low-level connectivity to deliver a desktop experience tailored for professionals.

---

## 🛠️ Key Features

### 🖥️ Multi-Protocol Terminal Management
- **SSH2, Mosh, Serial, and Local PTY**: Connect to any remote or local environment with high responsiveness.
- **Split Panes & Workspaces**: Flexible split-pane layouts (horizontal/vertical) to monitor multiple machines side-by-side.
- **Customizable Appearance**: Tailor themes, typography, cursor styles, transparency, and background blur.

### 📁 Integrated SFTP File Manager
- **Remote File Browser**: Browse, upload, download, and manage files on remote servers without external tools.
- **In-App & External Editor Sync**: Edit remote files locally with automatic background file watching and sync.

### 🔐 Secure Vault & Keychain
- **SafeStorage Encryption**: Securely store host connection credentials, SSH private keys, and passphrase tokens.
- **Jump Host & Proxy Support**: Configure SSH ProxyCommand and ProxyJump chains effortlessly.
- **App Lock**: Protect your open workspace with a master password, biometric unlock, and automatic inactivity timeout.

### 🌐 Port Forwarding Tunnels
- **Local, Remote & Dynamic (SOCKS5)**: Configure and toggle SSH port forwarding rules with one click.
- **Live Traffic Monitoring**: Track active connections, throughput, and tunnel status in real-time.

### ⚡ Snippets & Automation
- **Reusable Script Library**: Organize command snippets by categories and tags.
- **One-Click Execution**: Insert or run parameterized scripts directly in active terminal sessions.

---

## 👨‍💻 Development & Attribution

- **Application Name**: YetiTerm
- **Version**: 1.0.0
- **Developed by**: Bijesh Lal Nyachhyon
- **Department**: IT Department
- **Organization**: DataHub Pvt. Ltd.
- **Copyright**: © 2026 DataHub Pvt. Ltd. All rights reserved.

---

## 📋 Change Log

### Version 1.0.0 (Initial Production Release)
- **Brand & Identity**: Rebranded the application to **YetiTerm** with the custom logo and iconography across all platforms, including macOS dock, DMG installer, window headers, and splash screens.
- **Quit Confirmation Dialog**: Added a confirmation prompt ("Are you sure you want to quit YetiTerm? Any active terminal sessions will be terminated.") upon quitting the application with Yes / No options to prevent accidental disconnection.
- **Security Hardening & Expert Audit**:
  - **Process Isolation**: Explicitly enforced `webSecurity: true`, `allowRunningInsecureContent: false`, and `experimentalFeatures: false` across all Electron renderer windows.
  - **Content Security Policy (CSP)**: Hardened `index.html` with restrictive directives (`object-src 'none'; base-uri 'self'; form-action 'self';`).
  - **App Lock Credential Gate**: Sealed credential decryption IPC handlers (`credentials:decrypt`) whenever App Lock is active, preventing locked renderers from reading plaintext secrets.
  - **Path Traversal & Injection Defense**: Hardened file system bridges (`localFsBridge` and `openPath`) against null-byte poisoning and untrusted input paths.
- **Attribution**: Added official developer and organization attribution in Settings > Application (*Developed by Bijesh Lal Nyachhyon, IT Department, DataHub Pvt. Ltd.*).
- **Settings Optimization**:
  - Streamlined settings interface by removing unnecessary cloud sync, system menus, and extraneous capability cards.
  - Standardized application icon usage to the official YetiTerm logo.
- **Host Management**:
  - Fixed known hosts deletion bug to ensure accurate host entry management.
  - Enhanced host grouping, filtering, and quick search.
- **Platform Packaging**:
  - Configured native macOS DMG generation for Apple Silicon (`arm64`) and Intel (`x64`).
  - Added multi-resolution ICNS and PNG assets.

---

## 💻 Building from Source

### Prerequisites
- **Node.js**: `>= 22.0.0`
- **npm**: `>= 10.0.0`

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd DH-SSH-Clients

# Install dependencies
npm install
```

### Development Mode
```bash
# Start Vite and Electron in dev mode
npm run dev
```

### Production Build & Packaging
```bash
# Build web bundles
npm run build

# Package macOS DMG (Apple Silicon)
npx electron-builder --config electron-builder.config.cjs --mac dmg --arm64 --publish=never
```

---

## 📄 License

This project is licensed under the GNU General Public License v3.0 or later (GPL-3.0-or-later).
