import Footer from "@/components/layout/footer";

export default function PagesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {children}
            {/* <Footer /> */}
        </>
    );
}
