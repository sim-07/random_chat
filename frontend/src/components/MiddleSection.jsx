import React from 'react';
import '../assets/styles/MiddleSection.css';
import IconaChatting from '../assets/images/IconaChatting';
import LockChat from '../assets/images/lock_chat';


const middleSection = () => {
    return (
        <div className="middleSection">
            <h1 style={{ fontSize: '47px' }}>Cosa offriamo?</h1>
            <div className='middleSectionOffer'>
                <h3 className='offerText'>
                    <span style={{ color: 'rgb(152, 255, 152)' }}>RandomChat</span> è progettata per facilitare l'incontro e l'interazione con nuove persone in modo semplice e divertente. <br /><br />
                    Se vuoi parlare con qualcuno, fare amicizia o semplicemente passare del tempo, <span style={{ color: 'rgb(152, 255, 152)' }}>RandomChat</span> è la piattaforma perfetta per te.
                </h3>
                <IconaChatting />
            </div>

            <div>
                <h1 style={{ fontSize: '47px' }}>Come funziona?</h1>
                <div className='middleSectionFunction'>
                    <LockChat />
                    <h3 className='functionText'>
                        Utilizzare <span style={{ color: 'rgb(152, 255, 152)' }}>RandomChat</span> è semplice e veloce.<br />
                        <span style={{ color: 'rgb(152, 255, 152)' }}>Non è necessaria alcuna registrazione:</span> basta accedere al sito e iniziare a chattare.<br />
                        La nostra piattaforma è completamente gratuita, così puoi connetterti con altre persone senza alcun costo. <br /><br />
                        Per garantire un'esperienza sicura e autentica, <span style={{ color: 'rgb(152, 255, 152)' }}>abbiamo implementato dei controlli avanzati per prevenire la presenza di bot</span> e garantire che tu possa interagire con persone reali.<br />
                        La tua privacy e sicurezza sono la nostra priorità, e lavoriamo costantemente per mantenere l'ambiente di chat piacevole e protetto.
                    </h3>
                </div>
            </div>
        </div>
    );
};

export default middleSection;
