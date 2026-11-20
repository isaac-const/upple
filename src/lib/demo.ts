// Modo demonstração: um "Supabase" em memória com dados FICTÍCIOS, usado quando não há credenciais.
// Serve para rodar o app, fazer capturas e trailers sem backend. Nada aqui é real.
type Row = Record<string, any>

// Logos fictícios desenhados em canvas (somente web). No celular cai para o ícone padrão do app.
const logo = (letter: string, a: string, b: string): string | null => {
  if (typeof document === 'undefined') return null
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const x = c.getContext('2d')
  if (!x) return null
  const g = x.createLinearGradient(0, 0, 256, 256)
  g.addColorStop(0, a)
  g.addColorStop(1, b)
  x.fillStyle = g
  x.beginPath()
  ;(x as any).roundRect(0, 0, 256, 256, 64)
  x.fill()
  x.fillStyle = '#ffffff'
  x.font = '800 132px Arial, Helvetica, sans-serif'
  x.textAlign = 'center'
  x.textBaseline = 'middle'
  x.fillText(letter, 128, 138)
  return c.toDataURL('image/png')
}

const daysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString()

const profiles: Row[] = [
  { id: 'u0', username: 'demo', avatar_url: null, role: 'user' },
  { id: 'u1', username: 'ana.dev', avatar_url: null, role: 'user' },
  { id: 'u2', username: 'bruno', avatar_url: null, role: 'user' },
  { id: 'u3', username: 'clara.codes', avatar_url: null, role: 'user' },
  { id: 'u4', username: 'diego', avatar_url: null, role: 'user' },
]

const posts: Row[] = [
  { id: 'p1', name: 'Lumen Notes', type: 'APP', user_id: 'u1', created_at: daysAgo(1), image_url: logo('L', '#7c5cff', '#4c2fd0'), description: 'Anotações rápidas com markdown, etiquetas e busca instantânea. Tudo guardado no seu aparelho.', github_link: 'https://example.com/lumen', official_link: null },
  { id: 'p2', name: 'Orbit CLI', type: 'SOFTWARE', user_id: 'u2', created_at: daysAgo(2), image_url: logo('O', '#22c1c3', '#0e7490'), description: 'Terminal que lembra os comandos que você mais usa e sugere atalhos no momento certo.', github_link: 'https://example.com/orbit', official_link: null },
  { id: 'p3', name: 'Pixel Garden', type: 'APP', user_id: 'u3', created_at: daysAgo(3), image_url: logo('P', '#7bd36b', '#2f8f4e'), description: 'Jogo de relaxar: plante, regue e decore um jardim em pixel art. Sem anúncios.', github_link: 'https://example.com/garden', official_link: null },
  { id: 'p4', name: 'Fluxo Tasks', type: 'APP', user_id: 'u4', created_at: daysAgo(4), image_url: logo('F', '#ff8a5b', '#d6452a'), description: 'Lista de tarefas com quadro kanban e lembretes por localização.', github_link: 'https://example.com/fluxo', official_link: null },
  { id: 'p5', name: 'Cobalt DB', type: 'SOFTWARE', user_id: 'u2', created_at: daysAgo(5), image_url: logo('C', '#4a86ff', '#1d4ed8'), description: 'Banco de dados leve para projetos pequenos, com painel web e backups automáticos.', github_link: 'https://example.com/cobalt', official_link: null },
  { id: 'p6', name: 'Maré Player', type: 'APP', user_id: 'u1', created_at: daysAgo(6), image_url: logo('M', '#f472b6', '#be185d'), description: 'Player de música local, com letras sincronizadas e modo noturno.', github_link: 'https://example.com/mare', official_link: null },
]

const comments: Row[] = [
  { id: 'c1', post_id: 'p1', user_id: 'u2', content: 'Gostei muito do atalho para criar nota. Funciona offline?', created_at: daysAgo(0.6) },
  { id: 'c2', post_id: 'p1', user_id: 'u3', content: 'A busca é rápida mesmo com muitas notas. Parabéns!', created_at: daysAgo(0.3) },
  { id: 'c3', post_id: 'p2', user_id: 'u4', content: 'Boa ideia sugerir atalhos. Usaria no dia a dia.', created_at: daysAgo(1) },
  { id: 'c4', post_id: 'p3', user_id: 'u1', content: 'Muito relaxante, a música combina com o jogo.', created_at: daysAgo(2) },
]

const voteCounts: Record<string, number> = { p1: 128, p2: 94, p3: 87, p4: 41, p5: 36, p6: 22 }
const votes: Row[] = []
let vid = 1
for (const [pid, n] of Object.entries(voteCounts)) for (let i = 0; i < n; i++) votes.push({ id: vid++, post_id: pid, user_id: 'x' + i })

const db: Record<string, Row[]> = { profiles, posts, comments, votes, reports: [] }
const uid = () => 'd' + Math.random().toString(36).slice(2, 10)

const hydrate = (table: string, r: Row): Row => {
  const out = { ...r }
  if (table === 'posts') {
    out.profiles = { username: profiles.find((p) => p.id === r.user_id)?.username ?? 'anônimo' }
    out.votes = [{ count: votes.filter((v) => v.post_id === r.id).length }]
    out.comments = [{ count: comments.filter((c) => c.post_id === r.id).length }]
  }
  if (table === 'comments') {
    const p = profiles.find((p) => p.id === r.user_id)
    out.profiles = { username: p?.username ?? 'anônimo', avatar_url: p?.avatar_url ?? null }
  }
  return out
}

class Query implements PromiseLike<any> {
  private op: 'select' | 'insert' | 'delete' | 'update' = 'select'
  private filters: ((r: Row) => boolean)[] = []
  private ord: { col: string; asc: boolean } | null = null
  private lim: number | null = null
  private one = false
  private payload: Row = {}
  private wantCount = false
  constructor(private table: string) {}
  select(_cols?: string, opts?: { count?: string }) { if (this.op === 'select') this.op = 'select'; this.wantCount = opts?.count === 'exact'; return this }
  insert(row: Row) { this.op = 'insert'; this.payload = row; return this }
  update(row: Row) { this.op = 'update'; this.payload = row; return this }
  delete() { this.op = 'delete'; return this }
  eq(c: string, v: any) { this.filters.push((r) => String(r[c]) === String(v)); return this }
  match(o: Row) { Object.entries(o).forEach(([k, v]) => this.eq(k, v)); return this }
  or(expr: string) {
    const parts = expr.split(',').map((p) => p.split('.ilike.'))
    this.filters.push((r) => parts.some(([c, pat]) => String(r[c] ?? '').toLowerCase().includes(pat.replace(/%/g, '').toLowerCase())))
    return this
  }
  order(col: string, o?: { ascending?: boolean }) { this.ord = { col, asc: o?.ascending ?? true }; return this }
  limit(n: number) { this.lim = n; return this }
  single() { this.one = true; return this }
  private run() {
    const rows = db[this.table] ?? (db[this.table] = [])
    if (this.op === 'insert') {
      const row = { id: uid(), created_at: new Date().toISOString(), ...this.payload }
      rows.push(row)
      const data = hydrate(this.table, row)
      return { data: this.one ? data : [data], error: null, count: null }
    }
    let list = rows.filter((r) => this.filters.every((f) => f(r)))
    if (this.op === 'delete') { db[this.table] = rows.filter((r) => !list.includes(r)); return { data: null, error: null, count: null } }
    if (this.op === 'update') { list.forEach((r) => Object.assign(r, this.payload)); return { data: null, error: null, count: null } }
    if (this.ord) { const { col, asc } = this.ord; list = [...list].sort((a, b) => (a[col] > b[col] ? 1 : -1) * (asc ? 1 : -1)) }
    const count = list.length
    if (this.lim != null) list = list.slice(0, this.lim)
    const data = list.map((r) => hydrate(this.table, r))
    if (this.one) return data[0] ? { data: data[0], error: null, count } : { data: null, error: { message: 'not found' }, count }
    return { data, error: null, count: this.wantCount ? count : null }
  }
  then<R1 = any, R2 = never>(res?: ((v: any) => R1 | PromiseLike<R1>) | null, rej?: ((e: any) => R2 | PromiseLike<R2>) | null) {
    return Promise.resolve().then(() => this.run()).then(res, rej)
  }
}

const rankingView = () =>
  [...posts].map((p) => ({ id: p.id, name: p.name, image_url: p.image_url, vote_count: votes.filter((v) => v.post_id === p.id).length }))
    .sort((a, b) => b.vote_count - a.vote_count)

const session = { user: { id: 'u0', email: 'demo@upple.app', user_metadata: { user_role: 'user' } } } as any
let current: any = session
const listeners: ((e: string, s: any) => void)[] = []

export const demoClient: any = {
  from: (table: string) => (table === 'weekly_ranking' ? new RankingQuery() : new Query(table)),
  rpc: async () => ({ data: null, error: null }),
  storage: { from: () => ({ upload: async () => ({ error: null }), remove: async () => ({ error: null }), getPublicUrl: () => ({ data: { publicUrl: '' } }) }) },
  auth: {
    getSession: async () => ({ data: { session: current } }),
    onAuthStateChange: (cb: (e: string, s: any) => void) => { listeners.push(cb); return { data: { subscription: { unsubscribe: () => { const i = listeners.indexOf(cb); if (i >= 0) listeners.splice(i, 1) } } } } },
    signInWithPassword: async () => { current = session; listeners.forEach((l) => l('SIGNED_IN', current)); return { data: { session }, error: null } },
    signUp: async () => ({ data: { user: session.user }, error: null }),
    signOut: async () => { current = null; listeners.forEach((l) => l('SIGNED_OUT', null)); return { error: null } },
  },
}

class RankingQuery implements PromiseLike<any> {
  private lim = 3
  select() { return this }
  limit(n: number) { this.lim = n; return this }
  then<R1 = any, R2 = never>(res?: ((v: any) => R1 | PromiseLike<R1>) | null, rej?: ((e: any) => R2 | PromiseLike<R2>) | null) {
    return Promise.resolve({ data: rankingView().slice(0, this.lim), error: null }).then(res, rej)
  }
}
