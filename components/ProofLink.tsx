'use client';

import { useRef, useState } from 'react';

const isImage = (n: string) => /\.(jpe?g|png|webp|gif|avif)$/i.test(n);
const isPdf = (n: string) => /\.pdf$/i.test(n);

/** A proof file link that opens a preview dialog instead of a new page. */
export function ProofLink({ name, url }: { name: string; url: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);
  const previewable = (isImage(name) || isPdf(name)) && !failed;

  // Files the browser can't preview (e.g. HEIC) just open in a new tab.
  if (!isImage(name) && !isPdf(name)) {
    return <a href={url} target="_blank" rel="noreferrer" className="proof">{name}</a>;
  }

  return (
    <>
      <button
        type="button"
        className="proof linkbtn"
        onClick={() => {
          setOpen(true);
          dialog.current?.showModal();
        }}
      >
        {name}
      </button>
      <dialog
        ref={dialog}
        className="preview"
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === dialog.current) dialog.current?.close();
        }}
      >
        <div className="preview-bar">
          <b className="grow">{name}</b>
          <a href={url} target="_blank" rel="noreferrer" className="btn soft sm">Open in new tab</a>
          <button type="button" className="btn primary sm" onClick={() => dialog.current?.close()}>Close</button>
        </div>
        <div className="preview-body">
          {/* The file is only requested once the dialog is opened. */}
          {open && previewable ? (
            isPdf(name) ? (
              <iframe src={url} title={name} />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={url} alt={name} onError={() => setFailed(true)} />
            )
          ) : null}
          {open && failed ? <p className="muted">Can’t preview this file here. Use “Open in new tab”.</p> : null}
        </div>
      </dialog>
    </>
  );
}
