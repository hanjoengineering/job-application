import { createClient } from '@supabase/supabase-js'

export interface Database {
    public: {
      Tables: {
        entries: {
          Row: {               // the data expected from .select()
            id: number
            content: string
          }
          Insert: {            // the data to be passed to .insert()
            id?: never         // generated columns must not be supplied
            content: string       // `not null` columns with no default must be supplied
          }
          Update: {            // the data to be passed to .update()
            content: string      // `not null` columns are optional on .update()
          }
        }
      }
    }
  }

const databaseUrl = import.meta.env.VITE_DATABASE_URL
const anonKey = import.meta.env.VITE_DATABASE_KEY

const supabase = createClient<Database>(
    databaseUrl,
    anonKey
  )

    
});

export default logger