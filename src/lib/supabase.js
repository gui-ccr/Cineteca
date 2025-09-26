import { createClient } from '@supabase/supabase-js'

// Configurações do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Credenciais do Supabase não configuradas!')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Funções auxiliares para autenticação
export const authHelpers = {
  // Login
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  // Registro
  async signUp(email, password, metadata = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
    return { data, error }
  },

  // Logout
  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Obter usuário atual
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  // Escutar mudanças de auth
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Funções para gerenciar filmes
export const movieHelpers = {
  // Buscar todos os filmes
  async getAllMovies() {
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .order('created_at', { ascending: false })
    return data || []
  },

  // Buscar filme por ID
  async getMovieById(id) {
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .eq('id', id)
      .single()
    return { data, error }
  },

  // Adicionar novo filme (admin)
  async addMovie(movieData) {
    const { data, error } = await supabase
      .from('movies')
      .insert([movieData])
      .select()
    return { data, error }
  },

  // Criar filme (admin) - alias para addMovie
  async createMovie(movieData) {
    return await this.addMovie(movieData);
  },

  // Atualizar filme (admin)
  async updateMovie(id, movieData) {
    const { data, error } = await supabase
      .from('movies')
      .update(movieData)
      .eq('id', id)
      .select()
    return { data, error }
  },

  // Deletar filme (admin)
  async deleteMovie(id) {
    const { data, error } = await supabase
      .from('movies')
      .delete()
      .eq('id', id)
    return { data, error }
  }
}

// Funções para gerenciar sessões
export const sessionHelpers = {
  // Buscar sessões de um filme
  async getMovieSessions(movieId) {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('movie_id', movieId)
      .order('time', { ascending: true })
    return { data, error }
  },

  // Buscar todas as sessões (admin)
  async getAllSessions() {
    const { data, error } = await supabase
      .from('sessions')
      .select(`
        *,
        movies (
          id,
          title
        )
      `)
      .order('date', { ascending: true })
    return data || []
  },

  // Adicionar nova sessão (admin)
  async addSession(sessionData) {
    const { data, error } = await supabase
      .from('sessions')
      .insert([sessionData])
      .select()
    return { data, error }
  },

  // Criar sessão (admin) - alias para addSession
  async createSession(sessionData) {
    const { data, error } = await supabase
      .from('sessions')
      .insert([sessionData])
      .select()
    if (error) throw new Error(error.message)
    return data[0]
  },

  // Atualizar sessão (admin)
  async updateSession(id, sessionData) {
    const { data, error } = await supabase
      .from('sessions')
      .update(sessionData)
      .eq('id', id)
      .select()
    return { data, error }
  },

  // Deletar sessão (admin)
  async deleteSession(id) {
    const { data, error } = await supabase
      .from('sessions')
      .delete()
      .eq('id', id)
    return { data, error }
  }
}

// Funções para gerenciar poltronas/assentos
export const seatHelpers = {
  // Buscar poltronas de uma sessão
  async getSessionSeats(sessionId) {
    const { data, error } = await supabase
      .from('seats')
      .select('*')
      .eq('session_id', sessionId)
      .order('row, number', { ascending: true })
    return { data, error }
  },

  // Reservar poltronas
  async reserveSeats(seatIds, userId) {
    const { data, error } = await supabase
      .from('seats')
      .update({ 
        status: 'reserved', 
        reserved_by: userId,
        reserved_at: new Date().toISOString()
      })
      .in('id', seatIds)
      .select()
    return { data, error }
  },

  // Confirmar compra das poltronas
  async confirmSeats(seatIds, ticketId) {
    const { data, error } = await supabase
      .from('seats')
      .update({ 
        status: 'sold',
        ticket_id: ticketId
      })
      .in('id', seatIds)
      .select()
    return { data, error }
  }
}

// Funções para gerenciar ingressos/tickets
export const ticketHelpers = {
  // Criar novo ingresso
  async createTicket(ticketData) {
    const { data, error } = await supabase
      .from('tickets')
      .insert([ticketData])
      .select()
    return { data, error }
  },

  // Buscar ingressos do usuário
  async getUserTickets(userId) {
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        sessions (
          *,
          movies (*)
        ),
        seats (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  // Buscar ingresso por código
  async getTicketByCode(code) {
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        sessions (
          *,
          movies (*)
        ),
        seats (*)
      `)
      .eq('code', code)
      .single()
    return { data, error }
  },

  // Buscar todos os tickets (admin)
  async getAllTickets() {
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        profiles (name, email),
        sessions (
          *,
          movies (title)
        ),
        seats (seat_number)
      `)
      .order('created_at', { ascending: false })
    return data || []
  }
}

// Funções para gerenciar perfil do usuário
export const profileHelpers = {
  // Buscar perfil do usuário
  async getProfile(userId) {
    console.log('getProfile chamado com ID:', userId);
    
    // Primeiro tentar por ID
    let { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    console.log('Resultado busca por ID:', { data, error });
    
    // Se não encontrar por ID, tentar por email (fallback)
    if (error && error.code === 'PGRST116') {
      console.log('Tentando buscar por email como fallback...');
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user?.email) {
        const result = await supabase
          .from('profiles')
          .select('*')
          .eq('email', userData.user.email)
          .single();
        console.log('Resultado busca por email:', result);
        return result;
      }
    }
    
    return { data, error }
  },

  // Atualizar perfil do usuário
  async updateProfile(userId, profileData) {
    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', userId)
      .select()
    return { data, error }
  },

  // Criar perfil inicial (chamado após registro)
  async createProfile(profileData) {
    const { data, error } = await supabase
      .from('profiles')
      .insert([profileData])
      .select()
    return { data, error }
  },

  // Buscar todos os usuários (admin)
  async getAllProfiles() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    return data || []
  }
}