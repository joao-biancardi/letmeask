import toast from 'react-hot-toast';

import copyImg from '../../assets/images/copy.svg';

import './styles.scss';

type RoomCodeProps = {
    code: string;
}

export function RoomCode(props: RoomCodeProps) {
    function copyRoomCodeToClipeboard() {
        navigator.clipboard.writeText(props.code)

        toast.success('Code copied successfully!')
    }

    return (
        <button className="room-code" onClick={copyRoomCodeToClipeboard}>
            <div>
                <img src={copyImg} alt="Copy room code" />
            </div>
            <span>Sala #{props.code}</span>
        </button>
    )
}