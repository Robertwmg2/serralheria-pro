import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { t } from "@/lib/i18n";

const NotFound = () => {
  const location = useLocation();
  const { locale } = useStore();

  useEffect(() => {
    console.error(`${t(locale, "common.route404")} ${location.pathname}`);
  }, [location.pathname, locale]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">{t(locale, "common.notFoundTitle")}</p>
        <Link to="/" className="text-primary underline hover:text-primary/90">
          {t(locale, "common.notFoundLink")}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
