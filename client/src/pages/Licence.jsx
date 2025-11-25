import { useNavigate } from "react-router-dom";
export default function Licence() {
  const navigate = useNavigate();
  return (
    <div className="page-container">
      <div className="page-container-section">
        <div className="div-box-container">
          <h1>Licence MIT</h1>

          <p>Copyright (c) 2025 Ahmed Nadir Nemmas</p>

          <p>
            Permission is hereby granted, free of charge, to any person
            obtaining a copy of this software and associated documentation files
            (the &quot;Software&quot;), to deal in the Software without
            restriction, including without limitation the rights to use, copy,
            modify, merge, publish, distribute, sublicense, and/or sell copies
            of the Software, and to permit persons to whom the Software is
            furnished to do so, subject to the following conditions:
          </p>

          <p>
            The above copyright notice and this permission notice shall be
            included in all copies or substantial portions of the Software.
          </p>

          <p>
            THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY
            KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
            WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
            NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
            BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
            ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
            CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
            SOFTWARE.
          </p>

          <hr />

          <p className="licence-note">
            Ce projet est distribué sous la licence MIT. Vous pouvez consulter
            ce texte à tout moment sur cette page ou dans le fichier{" "}
            <code>LICENSE</code> à la racine du dépôt.
          </p>
          <button type="button" onClick={() => navigate("/")}>
            Retour à l&apos;accueil
          </button>
        </div>
      </div>
    </div>
  );
}
