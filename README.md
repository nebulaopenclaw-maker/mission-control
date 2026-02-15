# Mission Control 🌌

A comprehensive Next.js dashboard for managing Nebula and its specialized AI sub-agents.

## Features

- **Multi-Agent Management** - Nebula + 8 specialized sub-agents
  - Analyst & Investor
  - Marketing Expert
  - Content Writer
  - Business Dev
  - Croatian Tax & Law Expert
  - Chief Finance Expert
  - Reporting Expert
  - Project Manager

- **Real-time Chat** - WebSocket connection to OpenClaw Gateway
- **Email Management** - Integrated Gmail interface
- **Cron Jobs** - Schedule and manage tasks
- **Dark Mode** - Beautiful dark UI with Tailwind CSS
- **Mobile Responsive** - Full mobile support

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State**: Zustand
- **HTTP**: Axios
- **WebSocket**: Native ws

## Prerequisites

- Node.js 18+ and npm/yarn
- OpenClaw Gateway running (http://localhost:18789)
- OpenClaw Gateway token

## Local Development

### 1. Install Dependencies

```bash
cd mission-control
npm install
```

### 2. Set Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_GATEWAY_URL=http://localhost:18789
NEXT_PUBLIC_GATEWAY_TOKEN=your_gateway_token_here
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

### Step 1: Push to GitHub

```bash
cd mission-control
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/mission-control.git
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Set environment variables:
   - `NEXT_PUBLIC_GATEWAY_URL` = `http://your-gateway-url:18789`
   - `NEXT_PUBLIC_GATEWAY_TOKEN` = `your_gateway_token`
5. Click "Deploy"

### Step 3: Configure CORS (if needed)

If accessing a remote Gateway, configure the Gateway to accept requests from your Vercel domain:

```bash
openclaw config patch << 'EOF'
{
  "gateway": {
    "controlUi": {
      "allowedOrigins": ["https://mission-control.vercel.app"]
    }
  }
}
EOF
```

## Project Structure

```
mission-control/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main dashboard
│   └── globals.css         # Global styles
├── components/
│   ├── sidebar.tsx         # Navigation sidebar
│   ├── agent-chat.tsx      # Chat interface
│   ├── agent-manager.tsx   # Agent management
│   └── email-dashboard.tsx # Email interface
├── lib/
│   ├── types.ts           # TypeScript types
│   └── gateway.ts         # Gateway client
├── public/                 # Static assets
├── package.json
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

## Configuration

### Gateway Connection

Edit the `gatewayUrl` in settings to connect to a different Gateway:

```
Default: http://localhost:18789
```

### Agents

Agents are defined in `app/page.tsx` in the `AGENTS_CONFIG` array:

```typescript
const AGENTS_CONFIG = [
  { id: '1', name: 'Nebula', role: 'Main AI Assistant', ... },
  { id: '2', name: 'Analyst & Investor', role: 'Investment Strategist', ... },
  // ... more agents
];
```

## Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run linter
```

### Adding New Components

1. Create component in `components/`
2. Import in `app/page.tsx` or other components
3. Follow existing patterns for styling (Tailwind + dark mode)

### WebSocket Integration

The `lib/gateway.ts` provides a `GatewayClient` class:

```typescript
const client = new GatewayClient(url, token);
await client.connect();
client.on('message', (data) => { /* ... */ });
```

## Features to Implement

- [ ] Real WebSocket integration with Gateway
- [ ] Email sync from Gmail
- [ ] Message persistence (database)
- [ ] Agent creation/deletion
- [ ] Message history
- [ ] File uploads
- [ ] Voice messages
- [ ] Integration with crypto-market-data
- [ ] Calendar integration
- [ ] Analytics dashboard

## Security

- Gateway token stored in localStorage (consider using httpOnly cookies for production)
- CORS configured for Vercel domain
- No sensitive data hardcoded

## Support

For issues or questions:
1. Check OpenClaw docs: https://docs.openclaw.ai
2. See Gateway configuration: `openclaw config get`
3. Test Gateway connection: `curl http://localhost:18789`

## License

Private - Bill's Mission Control Dashboard

---

Built with ❤️ for Nebula and team.
