// hooks/useAuth.ts
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { supabase } from "@/utils/supabase";
import { User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}

const useAuth = (): AuthState => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();

    // Écouter les changements d'authentification
    const {
      data: { subscription },

    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth event:", event, session?.user?.email);

      if (event === "SIGNED_OUT" || !session?.user) {
        setUser(null);
        // router.push("/connexion");
      } else if (session?.user) {
        // Vérifier si l'email est confirmé
        if (!session.user.email_confirmed_at) {
          console.log("Email non confirmé, redirection...");
          router.push({
            pathname: "/inscription/verification-email",
            params: {
              email: session.user.email,
              fromAuth: "true",
            },
          });
          setUser(null);
        } else {
          console.log("Utilisateur authentifié:", session.user.email);
          setUser(session.user);
        }
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuth = async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Erreur lors de la vérification de session:", error);
        // router.push("/connexion");
        setLoading(false);
        return;
      }

      if (!session?.user) {
        console.log("Aucune session trouvée, redirection vers connexion");
        // router.push("/connexion");
        setLoading(false);
        return;
      }

      // Vérifier si l'email est confirmé
      if (!session.user.email_confirmed_at) {
        console.log("Email non confirmé, redirection vers vérification");
        router.push({
          pathname: "/inscription/verification-email",
          params: {
            email: session.user.email,
            fromAuth: "true",
          },
        });
        setUser(null);
        setLoading(false);
        return;
      }

      console.log("Session valide pour:", session.user.email);
      // console.log("🤼🤼user",session.user);


      
      setUser(session.user);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la vérification auth:", error);
      // router.push("/connexion");
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    isAuthenticated: !!user && !!user.email_confirmed_at,
  };
};

export default useAuth;
